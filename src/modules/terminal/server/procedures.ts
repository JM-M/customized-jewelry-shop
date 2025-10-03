import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/api";
import { db } from "@/db";
import {
  checkoutSessions,
  pickupAddresses,
  terminalAddresses,
  userTerminalAddresses,
} from "@/db/schema/logistics";
import { cartItems, carts, materials, products } from "@/db/schema/shop";
import {
  makeTerminalRequest,
  terminalClient,
  terminalSandboxClient,
} from "@/lib/terminal-client";
import {
  adminProcedure,
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { z } from "zod";
import {
  TerminalCreateAddressResponse,
  TerminalCreateParcelResponse,
  TerminalGetAddressResponse,
  TerminalGetCitiesResponse,
  TerminalGetCountriesResponse,
  TerminalGetDefaultSenderResponse,
  TerminalGetPackagingsResponse,
  TerminalGetRateResponse,
  TerminalGetRatesForShipmentResponse,
  TerminalGetStatesResponse,
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

// Schema for getting states by country code
const getStatesSchema = z.object({
  country_code: z
    .string()
    .length(2, "Country code must be a 2-letter ISO code"),
});

// Schema for getting cities by country code and optional state code
const getCitiesSchema = z.object({
  country_code: z
    .string()
    .length(2, "Country code must be a 2-letter ISO code"),
  state_code: z.string().optional(),
});

// Schema for creating a pickup address
const createPickupAddressSchema = z.object({
  // Terminal address fields
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

  // Pickup address fields
  isDefault: z.boolean().default(false).optional(),
  nickname: z.string().optional(),
});

// Schema for updating a pickup address
const updatePickupAddressSchema = z.object({
  id: z.string().min(1, "Pickup address ID is required"),
  terminalAddressId: z
    .string()
    .min(1, "Terminal address ID is required")
    .optional(),
  isDefault: z.boolean().optional(),
  nickname: z.string().optional(),
});

// Schema for getting a pickup address
const getPickupAddressSchema = z.object({
  id: z.string().min(1, "Pickup address ID is required"),
});

// Schema for deleting a pickup address
const deletePickupAddressSchema = z.object({
  id: z.string().min(1, "Pickup address ID is required"),
});

// Schema for marking a pickup address as default
const markDefaultPickupAddressSchema = z.object({
  id: z.string().min(1, "Pickup address ID is required"),
});

// Schema for creating a parcel
const createParcelSchema = z.object({
  description: z.string().optional(),
  items: z
    .array(
      z.object({
        description: z.string().min(1, "Item description is required"),
        name: z.string().min(1, "Item name is required"),
        currency: z.string().min(1, "Currency is required"),
        value: z.number().min(0, "Value must be non-negative"),
        weight: z.number().min(0, "Weight must be non-negative"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      }),
    )
    .min(1, "At least one item is required"),
  metadata: z.record(z.string(), z.any()).optional(),
  packaging: z.string().min(1, "Packaging ID is required"),
  proof_of_payments: z.array(z.string().url()).optional(),
  rec_docs: z.array(z.string().url()).optional(),
  weight_unit: z.literal("kg"),
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

  getAddress: protectedProcedure
    .input(getAddressSchema)
    .query(async ({ input, ctx }) => {
      // First, verify that the user owns this address
      const userAddress = await db
        .select()
        .from(userTerminalAddresses)
        .where(
          and(
            eq(userTerminalAddresses.userId, ctx.auth.user.id),
            eq(userTerminalAddresses.terminalAddressId, input.addressId),
          ),
        )
        .limit(1);

      if (userAddress.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only view your own addresses",
        });
      }

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

      // First, verify that the user owns this address
      const userAddress = await db
        .select()
        .from(userTerminalAddresses)
        .where(
          and(
            eq(userTerminalAddresses.userId, ctx.auth.user.id),
            eq(userTerminalAddresses.terminalAddressId, addressId),
          ),
        )
        .limit(1);

      if (userAddress.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update your own addresses",
        });
      }

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

  setDefaultSenderAddress: adminProcedure
    .input(setDefaultSenderAddressSchema)
    .mutation(async ({ input }) => {
      // Call Terminal API to set default sender address
      const terminalResult = await makeTerminalRequest(
        () =>
          terminalClient.post("/addresses/default/sender", {
            address_id: input.addressId,
          }),
        "Failed to set default sender address",
      );

      // Sync pickup addresses table - unset all other defaults
      await db
        .update(pickupAddresses)
        .set({ isDefault: false })
        .where(eq(pickupAddresses.isDefault, true));

      // Set the specified pickup address as default
      await db
        .update(pickupAddresses)
        .set({ isDefault: true })
        .where(eq(pickupAddresses.terminalAddressId, input.addressId));

      return terminalResult;
    }),

  getDefaultSenderAddress: adminProcedure.query(async () => {
    return makeTerminalRequest<TerminalGetDefaultSenderResponse>(
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

  getStates: baseProcedure.input(getStatesSchema).query(async ({ input }) => {
    const params = new URLSearchParams();
    params.append("country_code", input.country_code);

    const queryString = params.toString();
    const url = `/states?${queryString}`;

    return makeTerminalRequest<TerminalGetStatesResponse>(
      () => terminalClient.get(url),
      "Failed to get states",
    );
  }),

  getCities: baseProcedure.input(getCitiesSchema).query(async ({ input }) => {
    const params = new URLSearchParams();
    params.append("country_code", input.country_code);

    if (input.state_code) {
      params.append("state_code", input.state_code);
    }

    const queryString = params.toString();
    const url = `/cities?${queryString}`;

    return makeTerminalRequest<TerminalGetCitiesResponse>(
      () => terminalClient.get(url),
      "Failed to get cities",
    );
  }),

  getPackaging: adminProcedure
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

  createParcel: protectedProcedure
    .input(createParcelSchema)
    .mutation(async ({ input, ctx }) => {
      // Terminal API call
      const result = await makeTerminalRequest<TerminalCreateParcelResponse>(
        () => terminalClient.post("/parcels", input),
        "Failed to create parcel",
      );

      // Store user association and checkout state
      if (result.status) {
        try {
          // Check if user already has active checkout data
          const existingData = await db
            .select()
            .from(checkoutSessions)
            .where(
              and(
                eq(checkoutSessions.userId, ctx.auth.user.id),
                eq(checkoutSessions.status, "active"),
              ),
            )
            .limit(1);

          // TODO: Replace the if else with an upsert
          if (existingData.length > 0) {
            // Update existing checkout data
            await db
              .update(checkoutSessions)
              .set({
                parcelId: result.data.parcel_id,
                checkoutStep: "parcel_created",
                updatedAt: new Date(),
              })
              .where(eq(checkoutSessions.id, existingData[0].id));
          } else {
            // Create new checkout data
            await db.insert(checkoutSessions).values({
              userId: ctx.auth.user.id,
              parcelId: result.data.parcel_id,
              checkoutStep: "parcel_created",
              status: "active",
            });
          }
        } catch (error) {
          console.error("Failed to track parcel association:", error);
          // Don't fail the entire operation, just log the error
        }
      }

      return result;
    }),

  // Pickup Addresses procedures
  getPickupAddresses: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(DEFAULT_PAGE).optional(),
        limit: z.number().min(1).max(100).default(DEFAULT_PAGE_SIZE).optional(),
      }),
    )
    .query(async ({ input }) => {
      const page = input.page || DEFAULT_PAGE;
      const limit = input.limit || DEFAULT_PAGE_SIZE;
      const offset = (page - 1) * limit;

      // Get total count
      const totalCountResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(pickupAddresses);
      const totalCount = totalCountResult[0]?.count || 0;

      // Get paginated data
      const data = await db
        .select({
          ...getTableColumns(pickupAddresses),
          terminalAddress: getTableColumns(terminalAddresses),
        })
        .from(pickupAddresses)
        .innerJoin(
          terminalAddresses,
          eq(pickupAddresses.terminalAddressId, terminalAddresses.address_id),
        )
        .orderBy(desc(pickupAddresses.createdAt))
        .limit(limit)
        .offset(offset);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        items: data,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    }),

  getDefaultPickupAddress: adminProcedure.query(async () => {
    const [defaultPickup] = await db
      .select({
        ...getTableColumns(pickupAddresses),
        terminalAddress: getTableColumns(terminalAddresses),
      })
      .from(pickupAddresses)
      .innerJoin(
        terminalAddresses,
        eq(pickupAddresses.terminalAddressId, terminalAddresses.address_id),
      )
      .where(eq(pickupAddresses.isDefault, true))
      .limit(1);

    return defaultPickup || null;
  }),

  getPickupAddress: adminProcedure
    .input(getPickupAddressSchema)
    .query(async ({ input }) => {
      const result = await db
        .select({
          ...getTableColumns(pickupAddresses),
          terminalAddress: getTableColumns(terminalAddresses),
        })
        .from(pickupAddresses)
        .innerJoin(
          terminalAddresses,
          eq(pickupAddresses.terminalAddressId, terminalAddresses.address_id),
        )
        .where(eq(pickupAddresses.id, input.id))
        .limit(1);

      if (result.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pickup address not found",
        });
      }

      return result[0];
    }),

  createPickupAddress: adminProcedure
    .input(createPickupAddressSchema)
    .mutation(async ({ input }) => {
      // Extract terminal address fields from input
      const {
        city,
        country,
        state,
        email,
        first_name,
        last_name,
        name,
        phone,
        line1,
        line2,
        zip,
        is_residential,
        metadata,
        isDefault,
        nickname,
      } = input;

      // Create terminal address first
      const terminalAddressData = {
        city,
        country,
        state,
        email,
        first_name,
        last_name,
        name,
        phone,
        line1,
        line2,
        zip,
        is_residential,
        metadata,
      };

      // Terminal API call to create address
      const terminalResult =
        await makeTerminalRequest<TerminalCreateAddressResponse>(
          () => terminalClient.post("/addresses", terminalAddressData),
          "Failed to create terminal address",
        );

      if (!terminalResult.status) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create terminal address",
        });
      }

      // Sync terminal address to local database
      try {
        await db.insert(terminalAddresses).values({
          address_id: terminalResult.data.address_id,
          city: terminalResult.data.city,
          coordinates: terminalResult.data.coordinates,
          country: terminalResult.data.country,
          email: terminalResult.data.email,
          first_name: terminalResult.data.first_name,
          id: terminalResult.data.id,
          is_residential: terminalResult.data.is_residential,
          last_name: terminalResult.data.last_name,
          line1: terminalResult.data.line1,
          line2: terminalResult.data.line2,
          metadata: terminalResult.data.metadata,
          name: terminalResult.data.name,
          phone: terminalResult.data.phone,
          state: terminalResult.data.state,
          zip: terminalResult.data.zip,
          created_at: terminalResult.data.created_at,
          updated_at: terminalResult.data.updated_at,
        });
      } catch (error) {
        console.error(
          "Failed to sync terminal address to local database:",
          error,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to sync terminal address to local database",
        });
      }

      // If this is being set as default, unset all other defaults
      if (isDefault) {
        await db
          .update(pickupAddresses)
          .set({ isDefault: false })
          .where(eq(pickupAddresses.isDefault, true));
      }

      // Create pickup address
      const pickupResult = await db
        .insert(pickupAddresses)
        .values({
          terminalAddressId: terminalResult.data.address_id,
          isDefault: isDefault || false,
          nickname: nickname || null,
        })
        .returning();

      // If this is being set as default, also set it as the default sender address in Terminal
      if (isDefault) {
        await makeTerminalRequest(
          () =>
            terminalClient.post("/addresses/default/sender", {
              address_id: terminalResult.data.address_id,
            }),
          "Failed to set default sender address",
        );
      }

      return pickupResult[0];
    }),

  updatePickupAddress: adminProcedure
    .input(updatePickupAddressSchema)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;

      // Verify that the pickup address exists
      const existingPickupAddress = await db
        .select()
        .from(pickupAddresses)
        .where(eq(pickupAddresses.id, id))
        .limit(1);

      if (existingPickupAddress.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pickup address not found",
        });
      }

      // If terminal address is being updated, verify it exists
      if (updateData.terminalAddressId) {
        const terminalAddress = await db
          .select()
          .from(terminalAddresses)
          .where(eq(terminalAddresses.address_id, updateData.terminalAddressId))
          .limit(1);

        if (terminalAddress.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Terminal address not found",
          });
        }
      }

      // If this is being set as default, unset all other defaults
      if (updateData.isDefault) {
        await db
          .update(pickupAddresses)
          .set({ isDefault: false })
          .where(eq(pickupAddresses.isDefault, true));
      }

      const result = await db
        .update(pickupAddresses)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(pickupAddresses.id, id))
        .returning();

      return result[0];
    }),

  deletePickupAddress: adminProcedure
    .input(deletePickupAddressSchema)
    .mutation(async ({ input }) => {
      // Verify that the pickup address exists
      const existingPickupAddress = await db
        .select()
        .from(pickupAddresses)
        .where(eq(pickupAddresses.id, input.id))
        .limit(1);

      if (existingPickupAddress.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pickup address not found",
        });
      }

      await db.delete(pickupAddresses).where(eq(pickupAddresses.id, input.id));

      return { success: true };
    }),

  markDefaultPickupAddress: adminProcedure
    .input(markDefaultPickupAddressSchema)
    .mutation(async ({ input }) => {
      // Verify that the pickup address exists and get its terminal address ID
      const existingPickupAddress = await db
        .select({
          id: pickupAddresses.id,
          terminalAddressId: pickupAddresses.terminalAddressId,
          isDefault: pickupAddresses.isDefault,
        })
        .from(pickupAddresses)
        .where(eq(pickupAddresses.id, input.id))
        .limit(1);

      if (existingPickupAddress.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pickup address not found",
        });
      }

      const pickupAddress = existingPickupAddress[0];

      // If already default, return success
      if (pickupAddress.isDefault) {
        return { success: true, message: "Address is already the default" };
      }

      // Unset all other pickup addresses as default
      await db
        .update(pickupAddresses)
        .set({ isDefault: false })
        .where(eq(pickupAddresses.isDefault, true));

      // Set the specified pickup address as default
      await db
        .update(pickupAddresses)
        .set({ isDefault: true })
        .where(eq(pickupAddresses.id, input.id));

      // Sync with Terminal API - set as default sender address
      const terminalResult = await makeTerminalRequest<{ status: boolean }>(
        () =>
          terminalClient.post("/addresses/default/sender", {
            address_id: pickupAddress.terminalAddressId,
          }),
        "Failed to set default sender address in Terminal",
      );

      if (!terminalResult.status) {
        // If Terminal API call fails, rollback the database changes
        await db
          .update(pickupAddresses)
          .set({ isDefault: false })
          .where(eq(pickupAddresses.id, input.id));

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Failed to sync with Terminal API. Changes have been rolled back.",
        });
      }

      return {
        success: true,
        message: "Pickup address marked as default successfully",
      };
    }),

  // Checkout Session procedures
  getCheckoutSession: protectedProcedure.query(async ({ ctx }) => {
    const [checkoutSession] = await db
      .select()
      .from(checkoutSessions)
      .where(
        and(
          eq(checkoutSessions.userId, ctx.auth.user.id),
          eq(checkoutSessions.status, "active"),
        ),
      )
      .orderBy(desc(checkoutSessions.createdAt))
      .limit(1);

    return checkoutSession || null;
  }),

  updateCheckoutStep: protectedProcedure
    .input(
      z.object({
        step: z.enum([
          "address_selected",
          "parcel_created",
          "rates_generated",
          "rate_selected",
          "shipment_created",
          "payment_completed",
        ]),
        data: z
          .object({
            selectedAddressId: z.string().optional(),
            rateId: z.string().optional(),
            shipmentId: z.string().optional(),
            cartSnapshot: z.any().optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const checkoutData = await db
        .select()
        .from(checkoutSessions)
        .where(
          and(
            eq(checkoutSessions.userId, ctx.auth.user.id),
            eq(checkoutSessions.status, "active"),
          ),
        )
        .limit(1);

      if (checkoutData.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No active checkout session found",
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {
        checkoutStep: input.step,
        updatedAt: new Date(),
      };

      if (input.data) {
        if (input.data.selectedAddressId)
          updateData.selectedAddressId = input.data.selectedAddressId;
        if (input.data.rateId) updateData.rateId = input.data.rateId;
        if (input.data.shipmentId)
          updateData.shipmentId = input.data.shipmentId;
        if (input.data.cartSnapshot)
          updateData.cartSnapshot = input.data.cartSnapshot;
      }

      const result = await db
        .update(checkoutSessions)
        .set(updateData)
        .where(eq(checkoutSessions.id, checkoutData[0].id))
        .returning();

      return result[0];
    }),

  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        selectedAddressId: z.string().optional(),
        cartSnapshot: z.any().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Check if user already has active checkout session
      const existingSession = await db
        .select()
        .from(checkoutSessions)
        .where(
          and(
            eq(checkoutSessions.userId, ctx.auth.user.id),
            eq(checkoutSessions.status, "active"),
          ),
        )
        .limit(1);

      if (existingSession.length > 0) {
        // Update existing session
        const result = await db
          .update(checkoutSessions)
          .set({
            selectedAddressId: input.selectedAddressId,
            cartSnapshot: input.cartSnapshot,
            checkoutStep: "address_selected",
            updatedAt: new Date(),
          })
          .where(eq(checkoutSessions.id, existingSession[0].id))
          .returning();

        return result[0];
      } else {
        // Create new session
        const result = await db
          .insert(checkoutSessions)
          .values({
            userId: ctx.auth.user.id,
            selectedAddressId: input.selectedAddressId,
            cartSnapshot: input.cartSnapshot,
            checkoutStep: "address_selected",
            status: "active",
          })
          .returning();

        return result[0];
      }
    }),

  completeCheckoutSession: protectedProcedure
    .input(
      z.object({
        orderId: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const checkoutData = await db
        .select()
        .from(checkoutSessions)
        .where(
          and(
            eq(checkoutSessions.userId, ctx.auth.user.id),
            eq(checkoutSessions.status, "active"),
          ),
        )
        .limit(1);

      if (checkoutData.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No active checkout session found",
        });
      }

      const result = await db
        .update(checkoutSessions)
        .set({
          status: "completed",
          orderId: input.orderId,
          checkoutStep: "payment_completed",
          updatedAt: new Date(),
        })
        .where(eq(checkoutSessions.id, checkoutData[0].id))
        .returning();

      return result[0];
    }),

  getDeliveryRates: protectedProcedure
    .input(
      z.object({
        deliveryAddressId: z.string().min(1, "Delivery address ID is required"),
      }),
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      // 1. Get user's active cart with items
      const [cart] = await db
        .select()
        .from(carts)
        .where(and(eq(carts.userId, userId), eq(carts.status, "active")))
        .limit(1);

      if (!cart) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No active cart found",
        });
      }

      // 2. Get cart items with product details
      const cartItemsWithProducts = await db
        .select({
          ...getTableColumns(cartItems),
          product: {
            id: products.id,
            name: products.name,
            // weight: products.weight // TODO: Implement product weight
          },
          material: {
            id: materials.id,
            name: materials.name,
          },
        })
        .from(cartItems)
        .innerJoin(products, eq(cartItems.productId, products.id))
        .leftJoin(materials, eq(cartItems.materialId, materials.id))
        .where(eq(cartItems.cartId, cart.id));

      if (cartItemsWithProducts.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No items in cart",
        });
      }

      // 3. Check if user has existing checkout session with parcel
      const [checkoutSession] = await db
        .select()
        .from(checkoutSessions)
        .where(
          and(
            eq(checkoutSessions.userId, userId),
            eq(checkoutSessions.status, "active"),
          ),
        )
        .limit(1);

      let parcelId = checkoutSession?.parcelId;

      // 4. Create or update parcel if needed
      if (!parcelId || !checkoutSession) {
        // Create parcel from current cart items
        const parcelItems = cartItemsWithProducts.map((item) => ({
          name: item.product.name,
          description: `${item.product.name}${item.material ? ` - ${item.material.name}` : ""}`,
          currency: "NGN",
          value: Number(item.price),
          // weight: item.product.weight || 0.1, // Default weight if not set
          weight: 0.1, // Default weight if not set
          quantity: item.quantity,
        }));

        const parcelResult =
          await makeTerminalRequest<TerminalCreateParcelResponse>(
            () =>
              terminalClient.post("/parcels", {
                items: parcelItems,
                packaging: "PA-3XHSN4UG3BCWO5C6", // Placeholder as requested
                weight_unit: "kg",
                description: "Parcel for checkout", // TODO: Add description
              }),
            "Failed to create parcel",
          );

        if (!parcelResult.status) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create parcel",
          });
        }

        parcelId = parcelResult.data.parcel_id;

        // Update or create checkout session
        if (checkoutSession) {
          await db
            .update(checkoutSessions)
            .set({
              parcelId,
              selectedAddressId: input.deliveryAddressId,
              checkoutStep: "parcel_created",
              updatedAt: new Date(),
            })
            .where(eq(checkoutSessions.id, checkoutSession.id));
        } else {
          await db.insert(checkoutSessions).values({
            userId,
            parcelId,
            selectedAddressId: input.deliveryAddressId,
            checkoutStep: "parcel_created",
            status: "active",
          });
        }
      }

      // 5. Get default pickup address from Terminal API
      const defaultPickupResult =
        await makeTerminalRequest<TerminalGetDefaultSenderResponse>(
          () => terminalClient.get("/addresses/default/sender"),
          "Failed to get default pickup address",
        );

      if (
        !defaultPickupResult.status ||
        !defaultPickupResult.data?.address_id
      ) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No default pickup address configured",
        });
      }

      const pickupAddressId = defaultPickupResult.data.address_id;

      // 6. Get shipping rates from Terminal API
      const ratesResult =
        await makeTerminalRequest<TerminalGetRatesForShipmentResponse>(
          () =>
            terminalClient.get("/rates/shipment", {
              params: {
                parcel_id: parcelId,
                pickup_address: pickupAddressId,
                delivery_address: input.deliveryAddressId,
              },
            }),
          "Failed to get delivery rates",
        );

      if (!ratesResult.status) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get delivery rates",
        });
      }

      // 7. Update checkout session with rates
      await db
        .update(checkoutSessions)
        .set({
          checkoutStep: "rates_generated",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(checkoutSessions.userId, userId),
            eq(checkoutSessions.status, "active"),
          ),
        );

      return {
        rates: ratesResult.data,
        parcelId,
      };
    }),

  getRate: protectedProcedure
    .input(
      z.object({
        rateId: z.string().min(1, "Rate ID is required"),
      }),
    )
    .query(async ({ input }) => {
      const { rateId } = input;

      // Get rate details from Terminal API using the correct endpoint
      const rateResult = await makeTerminalRequest<TerminalGetRateResponse>(
        () => terminalClient.get(`/rates/${rateId}`),
        "Failed to get rate details",
      );

      return rateResult.data;
    }),
});
