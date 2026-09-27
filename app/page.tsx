'use client';

import { DiagramCanvas } from '@/components/canvas/DiagramCanvas';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { Separator } from '@/components/ui/separator';
import 'tldraw/tldraw.css'

export default function HomePage() {
  return (
    <div className="editor w-full h-full flex">
      <DiagramCanvas />
      <Separator orientation="vertical" className="h-full" />
      <ChatSidebar />
    </div>
  );
}
