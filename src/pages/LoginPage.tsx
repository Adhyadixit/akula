import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  
  // Signup form state
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if user exists
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', loginData.email)
        .single();

      if (userError) {
        toast({
          title: "Login failed",
          description: "User not found. Please check your email or sign up.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // In a real app, you would hash passwords and compare them securely
      // This is a simplified demo version
      if (userData) {
        // Store user session
        localStorage.setItem("userAuthenticated", "true");
        localStorage.setItem("userId", userData.id);
        localStorage.setItem("userEmail", userData.email);
        localStorage.setItem("userName", userData.full_name || "");
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${userData.full_name || 'User'}!`,
        });
        
        navigate("/");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate passwords match
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Signup failed",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', signupData.email)
        .single();

      if (existingUser) {
        toast({
          title: "Signup failed",
          description: "Email already registered. Please login instead.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: signupData.email,
          full_name: signupData.fullName,
          phone: signupData.phone,
          role: 'user' // Default role for new users
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      // In a real app, you would hash the password before storing it
      // For this demo, we're just creating the user record

      toast({
        title: "Signup successful",
        description: "Your account has been created. You can now login.",
      });

      // Switch to login tab
      setActiveTab("login");
      
      // Pre-fill login email
      setLoginData({
        ...loginData,
        email: signupData.email
      });
      
      // Reset signup form
      setSignupData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup error",
        description: "An error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Welcome to Wheelie Wanderlust
              </CardTitle>
              <CardDescription className="text-center">
                Login or create an account to book your ride
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="John Doe"
                        value={signupData.fullName}
                        onChange={handleSignupChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupEmail">Email</Label>
                      <Input
                        id="signupEmail"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+91 9876543210"
                        value={signupData.phone}
                        onChange={handleSignupChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupPassword">Password</Label>
                      <Input
                        id="signupPassword"
                        name="password"
                        type="password"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={signupData.confirmPassword}
                        onChange={handleSignupChange}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mt-2">
                By continuing, you agree to our{" "}
                <Link to="/terms-of-service" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy-policy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
