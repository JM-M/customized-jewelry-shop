"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlusIcon } from "lucide-react";

export const AddCustomizationForm = () => {
  return (
    <Card className="mt-6 gap-2 p-2">
      <CardHeader className="p-0">
        <CardTitle className="font-medium">Add New Option</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter customization option name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Enter description for this customization option"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="qr">QR Code</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Sample Image</Label>
          <Button variant="outline" className="w-full" type="button">
            <ImagePlusIcon className="size-4" />
            Add Sample Image
          </Button>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit">Add Option</Button>
        </div>
      </CardContent>
    </Card>
  );
};
