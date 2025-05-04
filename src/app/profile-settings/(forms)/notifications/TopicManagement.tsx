"use client";

import { Switch } from "@/components/ui/switch";
import { useNotifications } from "@/context/notification-context";
import { useTranslations } from "next-intl";

interface TopicManagementProps {
  availableTopics: {
    label: string;
    topic: string;
    desc: string;
  }[];
}

const TopicManagement: React.FC<TopicManagementProps> = ({ availableTopics }) => {

  const t = useTranslations('setting');
  const { subscription, subscribedTopics, updateTopic, setSubscribedTopics } = useNotifications();
  const endpoint = subscription?.endpoint;

  // Handle subscribe/unsubscribe actions
  const handleTopicToggle = async (topic: string) => {
    if (!endpoint) return;

    const action = subscribedTopics?.includes(topic) ? "unsubscribe" : "subscribe";
    updateTopic(endpoint, topic, action);
    setSubscribedTopics((prev) =>
      action === "subscribe" ? [...prev, topic] : prev.filter((t) => t !== topic)
    );
  };

  return (
    <div className="space-y-4">
      {availableTopics.map((data) => (
        <div key={data.topic}>
          <div className="flex flex-col gap-2">
            <p className="font-medium">{data.label}</p>
            <Switch
              checked={subscribedTopics?.includes(data.topic)}
              onCheckedChange={() => handleTopicToggle(data.topic)}
              disabled={data.topic == 'system'}
            />
            <span className="text-xs text-muted-foreground">
              {data.desc}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopicManagement;
