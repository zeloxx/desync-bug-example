# Liveblocks Tiptap Editor

## Getting Started

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`

## Steps to recreate

1. Open two browsers and navigate to this page, after they are both loaded, continue to step 2.
2. On browser 1, click the &quot;Toggle Simulate Typing&quot; button.
3. On browser 2, select some text in the editor, and backspace it while browser 1 is simulating typing.

## Expected behavior

The editor should not desync.

## Actual behavior

The editor will desync.
