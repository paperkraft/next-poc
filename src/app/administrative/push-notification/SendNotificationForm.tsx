"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useMounted } from "@/hooks/use-mounted";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { availableTopics } from "@/constants";

type Props = {
    users: { id: string; name: string }[];
};

type Mode = "topics" | "user";

export default function SendNotificationForm({ users }: Props) {
    const [mode, setMode] = useState<Mode>("topics");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [selectedTopic, setSelectedTopic] = useState<string | undefined>();
    const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);

    const mounted = useMounted();

    const sendNotification = async () => {
        if (!title || !message) {
            toast.error("Title and message are required.");
            return;
        }

        if (!selectedTopic && !selectedUserId) {
            toast.error("Select either a topic or a user to send the notification.");
            return;
        }

        const payload =
            mode === "topics"
                ? { topics: [selectedTopic], title, message }
                : { userId: selectedUserId, title, message };

        setLoading(true);

        try {
            const res = await fetch("/api/notifications/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success("Notification sent successfully.");
                setTitle("");
                setMessage("");
                setSelectedTopic(undefined);
                setSelectedUserId(undefined);
            } else {
                const data = await res.json();
                toast.error(data?.error || "Failed to send.");
            }
        } catch (err) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="max-w-md space-y-4">

            <div className="space-y-2">
                <Label>Mode</Label>
                <RadioGroup
                    defaultValue={mode}
                    onValueChange={(value) => setMode(value as Mode)}
                    className="flex space-x-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="topics" id="topics" />
                        <Label htmlFor="topics">By Topics</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="user" id="user" />
                        <Label htmlFor="user">To User</Label>
                    </div>
                </RadioGroup>
            </div>

            <div>
                <Label>Title</Label>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title"
                />
            </div>

            <div>
                <Label>Message</Label>
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter message"
                />
            </div>

            {mode === "topics" && (
                <div>
                    <Label>Topic</Label>
                    <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select topic" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableTopics.map((item) => (
                                <SelectItem key={item.topic} value={item.topic}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {mode === "user" && (
                <div>
                    <Label>User</Label>
                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent>
                            {users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                    {user.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <Button onClick={sendNotification} disabled={loading}>
                {loading ? "Sending..." : "Send Notification"}
            </Button>
        </div>
    );
}
