import { type Message } from "@/lib/types";
import { Timestamp } from "firebase/firestore";

type MessageBubbleProps = {
  message: Message;
};

function formatTimestamp(timestamp: Timestamp | null) {
    if (!timestamp) return "";
    return new Date(timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}


export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-end gap-2">
        <div className="max-w-xs md:max-w-md rounded-lg px-4 py-2 bg-gradient-to-br from-accent to-primary text-primary-foreground shadow-md">
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground ml-1">
        {message.sender} at {formatTimestamp(message.createdAt)}
      </p>
    </div>
  );
}
