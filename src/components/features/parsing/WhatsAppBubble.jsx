import { formatRelativeTime } from '@/lib/formatters'

export function WhatsAppBubble({ text, timestamp, senderName = 'Commerçant' }) {
  return (
    <div className="flex flex-col gap-1 max-w-[85%]">
      {senderName && (
        <p className="text-micro text-[#00a884] font-semibold px-1">{senderName}</p>
      )}
      <div className="wa-bubble">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
        {timestamp && (
          <p className="text-right text-[10px] text-gray-400 mt-1 -mb-0.5">
            {formatRelativeTime(timestamp)}
          </p>
        )}
      </div>
    </div>
  )
}
