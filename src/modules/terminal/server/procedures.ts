import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/api";
import { db } from "@/db";
import { terminalAddresses, userTerminalAddresses } from "@/db/schema/terminal";
import {
  makeTerminalRequest,
  terminalClient,
  terminalSandboxClient,
} from "@/lib/terminal-client";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { desc, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import {
  TerminalCreateAddressResponse,
  TerminalGetAddressResponse,
  TerminalGetCountriesResponse,
  TerminalGetPackagingsResponse,
} from "../types";

// Schema for creating an address
const createAddressSchema = z.object({
  city: z.string().min(1, "City is required"),
  country: z.string().length(2, "Country must be a 2-letter ISO code"),
  state: z.string().min(1, "State is required"),
  email: z.string().email("Invalid email format").optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  line1: z.string().optional(),
  line2: z.string().optional(),
  zip: z.string().optional(),
  is_residential: z.boolean().default(true),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Schema for getting addresses with pagination
const getAddressesSchema = z.object({
  perPage: z.number().min(1).max(100).default(DEFAULT_PAGE_SIZE).optional(),
  page: z.number().min(1).default(DEFAULT_PAGE).optional(),
});

// Schema for getting a single address
const getAddressSchema = z.object({
  addressId: z.string().min(1, "Address ID is required"),
});

// Schema for updating an address
const updateAddressSchema = z.object({
  addressId: z.string().min(1, "Address ID is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().length(2, "Country must be a 2-letter ISO code"),
  state: z.string().min(1, "State is required"),
  email: z.string().email("Invalid email format").optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  line1: z.string().optional(),
  line2: z.string().optional(),
  zip: z.string().optional(),
  is_residential: z.boolean().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Schema for validating an address
const validateAddressSchema = z.object({
  city: z.string().min(1, "City is required"),
  country: z.string().length(2, "Country must be a 2-letter ISO code"),
  line1: z.string().min(1, "Street address is required"),
  line2: z.string().optional(),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip/Postal code is required"),
});

// Schema for setting default sender address
const setDefaultSenderAddressSchema = z.object({
  addressId: z.string().min(1, "Address ID is required"),
});

// Schema for getting packagings with pagination and filtering
const getPackagingSchema = z.object({
  type: z.string().optional(),
  perPage: z.number().min(1).max(100).default(100).optional(),
  page: z.number().min(1).default(1).optional(),
});

export const terminalRouter = createTRPCRouter({
  testTerminal: baseProcedure.query(async () => {
    return makeTerminalRequest(
      () => terminalSandboxClient.get("/"),
      "Failed to test Terminal API connection",
    );
  }),

  getAddresses: baseProcedure
    .input(getAddressesSchema)
    .query(async ({ input }) => {
      const params = new URLSearchParams();

      if (input.perPage) {
        params.append("perPage", input.perPage.toString());
      }
      if (input.page) {
        params.append("page", input.page.toString());
      }

      const queryString = params.toString();
      const url = `/addresses${queryString ? `?${queryString}` : ""}`;

      return makeTerminalRequest(
        () => terminalClient.get(url),
        "Failed to get addresses",
      );
    }),

  getAddress: baseProcedure.input(getAddressSchema).query(async ({ input }) => {
    return makeTerminalRequest(
      () =>
        terminalClient.get<TerminalGetAddressResponse>(
          `/addresses/${input.addressId}`,
        ),
      "Failed to get address",
    );
  }),

  getUserAddresses: protectedProcedure.query(async ({ ctx }) => {
    return await db
      .select({
        ...getTableColumns(userTerminalAddresses),
        terminalAddress: getTableColumns(terminalAddresses),
      })
      .from(userTerminalAddresses)
      .innerJoin(
        terminalAddresses,
        eq(
          userTerminalAddresses.terminalAddressId,
          terminalAddresses.address_id,
        ),
      )
      .where(eq(userTerminalAddresses.userId, ctx.auth.user.id))
      .orderBy(desc(userTerminalAddresses.updatedAt));
  }),

  createAddress: protectedProcedure
    .input(createAddressSchema)
    .mutation(async ({ input, ctx }) => {
      // Terminal API call - no try-catch needed, tRPC handles errors
      const result = await makeTerminalRequest<TerminalCreateAddressResponse>(
        () => terminalClient.post("/addresses", input),
        "Failed to create address",
      );

      // Database sync - try-catch needed to handle gracefully
      if (result.status) {
        try {
          // Insert into terminalAddresses table
          await db.insert(terminalAddresses).values({
            address_id: result.data.address_id,
            city: result.data.city,
            coordinates: result.data.coordinates,
            country: result.data.country,
            email: result.data.email,
            first_name: result.data.first_name,
            id: result.data.id,
            is_residential: result.data.is_residential,
            last_name: result.data.last_name,
            line1: result.data.line1,
            line2: result.data.line2,
            metadata: result.data.metadata,
            name: result.data.name,
            phone: result.data.phone,
            state: result.data.state,
            zip: result.data.zip,
            created_at: result.data.created_at,
            updated_at: result.data.updated_at,
          });

          // Insert into userTerminalAddresses junction table
          await db.insert(userTerminalAddresses).values({
            userId: ctx.auth.user.id,
            terminalAddressId: result.data.address_id,
            nickname: result.data.metadata?.nickname || null,
            isDefault: result.data.metadata?.is_default || false,
          });
        } catch (error) {
          console.error("Failed to sync address to local database:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to sync address to local database",
          });
        }
      }

      return result;
    }),

  updateAddress: protectedProcedure
    .input(updateAddressSchema)
    .mutation(async ({ input, ctx }) => {
      const { addressId, ...updateData } = input;

      // Terminal API call - no try-catch needed, tRPC handles errors
      const result = await makeTerminalRequest(
        () => terminalClient.put(`/addresses/${addressId}`, updateData),
        "Failed to update address",
      );

      // Database sync - try-catch needed to handle gracefully
      try {
        // Update the terminalAddresses table with the new data
        await db
          .update(terminalAddresses)
          .set({
            city: updateData.city,
            country: updateData.country,
            state: updateData.state,
            email: updateData.email,
            first_name: updateData.first_name,
            last_name: updateData.last_name,
            name: updateData.name,
            phone: updateData.phone,
            line1: updateData.line1,
            line2: updateData.line2,
            zip: updateData.zip,
            is_residential: updateData.is_residential,
            metadata: updateData.metadata,
            updated_at: new Date().toISOString(),
          })
          .where(eq(terminalAddresses.address_id, addressId));

        // Update the updatedAt field in userTerminalAddresses table
        await db
          .update(userTerminalAddresses)
          .set({
            updatedAt: new Date(),
          })
          .where(eq(userTerminalAddresses.terminalAddressId, addressId));
      } catch (error) {
        console.error(
          "Failed to sync address update to local database:",
          error,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to sync address update to local database",
        });
      }

      return result;
    }),

  validateAddress: baseProcedure
    .input(validateAddressSchema)
    .mutation(async ({ input }) => {
      return makeTerminalRequest(
        () => terminalClient.post("/addresses/validate", input),
        "Failed to validate address",
      );
    }),

  setDefaultSenderAddress: baseProcedure
    .input(setDefaultSenderAddressSchema)
    .mutation(async ({ input }) => {
      return makeTerminalRequest(
        () =>
          terminalClient.post("/addresses/default/sender", {
            address_id: input.addressId,
          }),
        "Failed to set default sender address",
      );
    }),

  getDefaultSenderAddress: baseProcedure.query(async () => {
    return makeTerminalRequest(
      () => terminalClient.get("/addresses/default/sender"),
      "Failed to get default sender address",
    );
  }),

  getCountries: baseProcedure.query(async () => {
    return makeTerminalRequest<TerminalGetCountriesResponse>(
      () => terminalClient.get("/countries"),
      "Failed to get countries",
    );
  }),

  getPackaging: baseProcedure
    .input(getPackagingSchema)
    .query(async ({ input }) => {
      const params = new URLSearchParams();

      if (input.type) {
        params.append("type", input.type);
      }
      if (input.perPage) {
        params.append("perPage", input.perPage.toString());
      }
      if (input.page) {
        params.append("page", input.page.toString());
      }

      const queryString = params.toString();
      const url = `/packaging${queryString ? `?${queryString}` : ""}`;

      return makeTerminalRequest<TerminalGetPackagingsResponse>(
        () => terminalClient.get(url),
        "Failed to get packagings",
      );
    }),
});
