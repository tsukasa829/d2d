import Image from 'next/image';

interface ImageMessageProps {
  imageUrl: string;
  isBot: boolean;
}

export default function ImageMessage({ imageUrl, isBot }: ImageMessageProps) {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-xs ${isBot ? 'order-2' : 'order-1'}`}>
        <div className="rounded-lg overflow-hidden shadow-md">
          <Image
            src={imageUrl}
            alt="メッセージ画像"
            width={300}
            height={200}
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
