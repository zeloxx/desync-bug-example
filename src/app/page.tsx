'use client';

import { useLiveblocksExtension } from '@liveblocks/react-tiptap';
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from '@liveblocks/react/suspense';
import type { Editor as EditorType } from '@tiptap/react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { ReactNode, useEffect, useRef } from 'react';

const PUBLIC_KEY = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!;
if (!PUBLIC_KEY) {
    throw new Error('🔴 MISSING NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY - Add it to your .env.local');
}

export default function Page() {
    return (
        <Room>
            <Editor />
        </Room>
    );
}

function Room({ children }: { children: ReactNode }) {
    return (
        <LiveblocksProvider publicApiKey={PUBLIC_KEY}>
            <RoomProvider id="my-room">
                <ClientSideSuspense fallback={<div>Loading…</div>}>{children}</ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
}

function Editor() {
    const liveblocks = useLiveblocksExtension();

    const editor = useEditor({
        extensions: [liveblocks, StarterKit.configure({ history: false })],
        immediatelyRender: false,
        onContentError: (error) => {
            console.log('onContentError');
            console.dir(error, { depth: null });
        },
        onUpdate: (props) => {
            console.log('onUpdate');
            console.dir(props, { depth: null });
        },
        onTransaction: (props) => {
            console.log('onTransaction');
            console.dir(props, { depth: null });
        },
    });

    return (
        <div
            style={{
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                maxWidth: '800px',
                margin: '0 auto',
            }}
        >
            <Introduction />
            <EditorContent editor={editor} style={{ border: '1px solid white', minHeight: '16px' }} />
            <IntervalButton editor={editor} />
        </div>
    );
}

const IntervalButton = ({ editor }: { editor: EditorType | null }) => {
    const interval = useRef<NodeJS.Timeout | null>(null);

    const toggleInterval = () => {
        if (!editor) return;
        if (interval.current) {
            clearInterval(interval.current);
            interval.current = null;
        } else {
            interval.current = setInterval(() => {
                if (editor) {
                    editor.commands.insertContent('a');
                }
            }, 50);
        }
    };

    useEffect(
        () => () => {
            if (interval.current) clearInterval(interval.current);
        },
        [],
    );

    return (
        <button
            style={{
                padding: '10px',
                border: '1px solid white',
                cursor: 'pointer',
                maxWidth: '200px',
                backgroundColor: 'blue',
                color: 'white',
            }}
            onClick={toggleInterval}
        >
            Toggle Simulate Typing
        </button>
    );
};

function Introduction() {
    return (
        <>
            <h1 style={{ marginBottom: '10px' }}>Liveblocks Tiptap Editor</h1>
            <div style={{ backgroundColor: '#222222', padding: '10px' }}>
                <p>
                    <strong>We are experiencing a bug where the editor desyncs for users</strong>
                </p>
                <p style={{ marginTop: '10px' }}>
                    Steps to recreate:
                </p>
                <div style={{ marginTop: '10px' }}>
                    <p>
                        Step 1: Open two browsers and navigate to this page, after they are both loaded, continue to
                        step 2.
                    </p>
                    <p>Step 2: On browser 1, click the &quot;Toggle Simulate Typing&quot; button below.</p>
                    <p>
                        Step 3: On browser 2, select some text in the editor, and backspace it while browser 1 is
                        simulating typing.
                    </p>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <p>
                        Usually what will happen is that all updates from browser 1 will stop syncing to browser 2.
                    </p>
                    <p>After refreshing the page or re-syncing the ydoc, the contents will be corrected again.</p>
                </div>
            </div>
        </>
    );
}
