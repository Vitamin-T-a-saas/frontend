
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Key, Link as LinkIcon } from "lucide-react";
import { getCurrentUserInfo } from "../axios";


const Settings = () => {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getCurrentUserInfo();
        setProfile({
          name: res?.data?.full_name || "",
          email: res?.data?.email || "",
        });
      } catch (e) {
        setError("Failed to load user info");
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      // TODO: Replace with actual update endpoint (PUT /users/me)
      setSuccess("Changes saved (mock, backend update needed)");
    } catch (e) {
      setError("Failed to save changes");
    }
    setSaving(false);
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <Card className="p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-6">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Profile</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                VT
              </AvatarFallback>
            </Avatar>
            <Button variant="outline">Change Photo</Button>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Your name" value={profile.name} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="your.email@example.com" value={profile.email} onChange={handleChange} />
            </div>
          </div>
        </div>
      </Card>

      {/* Connected Accounts */}
      <Card className="p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-6">
          <LinkIcon className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Connected Accounts</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                IG
              </div>
              <div>
                <p className="font-medium">Instagram</p>
                <p className="text-sm text-muted-foreground">Not connected</p>
              </div>
            </div>
            <Button variant="outline">Connect</Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                @
              </div>
              <div>
                <p className="font-medium">Email Service</p>
                <p className="text-sm text-muted-foreground">Not connected</p>
              </div>
            </div>
            <Button variant="outline">Connect</Button>
          </div>
        </div>
      </Card>

      {/* API Configuration */}
      <Card className="p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-6">
          <Key className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">API Configuration</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">AI API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your API key for AI features"
            />
            <p className="text-sm text-muted-foreground">
              This key will be used for AI content generation features
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" disabled={saving || loading}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving || loading}>{saving ? "Saving..." : "Save Changes"}</Button>
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-600 mt-2">{success}</div>}
    </div>
  );
};

export default Settings;
