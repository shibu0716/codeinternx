"use client";

import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { seedPrograms } from "@/actions/admin";
import { useState } from "react";

export function SeedButton() {
  const [loading, setLoading] = useState(false);

  return (
    <Button 
      variant="outline" 
      onClick={async () => {
        setLoading(true);
        try {
          await seedPrograms();
          alert("Programs seeded successfully!");
        } catch (error: any) {
          alert(error.message);
        } finally {
          setLoading(false);
        }
      }}
      disabled={loading}
    >
      <Database className="w-4 h-4 mr-2" />
      {loading ? "Seeding..." : "Seed Default Programs"}
    </Button>
  );
}
