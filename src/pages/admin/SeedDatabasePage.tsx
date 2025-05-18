import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { seedDatabase } from "@/scripts/seedDatabase";
import { AlertCircle, CheckCircle, Database, Loader2 } from "lucide-react";

interface SeedResult {
  success: boolean;
  locations?: number;
  vehicles?: number;
  users?: number;
  bookings?: number;
  payments?: number;
  error?: any;
}

export default function SeedDatabasePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SeedResult | null>(null);

  const handleSeedDatabase = async () => {
    if (!confirm("This will add sample data to your database. Proceed?")) return;
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const seedResult = await seedDatabase();
      setResult(seedResult);
    } catch (error) {
      setResult({
        success: false,
        error
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Seed Database</h1>
        <p className="text-muted-foreground">
          Add sample data to your database for testing
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Seeding Tool
          </CardTitle>
          <CardDescription>
            This tool will populate your database with sample data for testing purposes.
            It will create locations, vehicles, users, bookings, and payments.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <h3 className="font-medium text-amber-800 mb-2">Important Notes</h3>
            <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
              <li>This will add sample data to your Supabase database</li>
              <li>Existing data with the same identifiers will be updated</li>
              <li>This is meant for development and testing purposes only</li>
              <li>Admin credentials: admin@wheeliewanderlust.com / admin123</li>
            </ul>
          </div>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              <div className="flex items-start gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 mt-0.5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 mt-0.5" />
                )}
                <div>
                  <AlertTitle>
                    {result.success ? "Database Seeded Successfully" : "Seeding Failed"}
                  </AlertTitle>
                  <AlertDescription>
                    {result.success ? (
                      <div className="space-y-2">
                        <p>The following data was added to your database:</p>
                        <ul className="list-disc list-inside text-sm">
                          <li>{result.locations} locations</li>
                          <li>{result.vehicles} vehicles</li>
                          <li>{result.users} users</li>
                          <li>{result.bookings} bookings</li>
                          <li>{result.payments} payments</li>
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <p>An error occurred while seeding the database:</p>
                        <pre className="text-xs mt-2 p-2 bg-red-50 rounded overflow-x-auto">
                          {JSON.stringify(result.error, null, 2)}
                        </pre>
                      </div>
                    )}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSeedDatabase} 
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Seeding Database...
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                Seed Database
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
