'use client'
/** @jsxRuntime classic */
/** @jsx jsx */

import { quote } from './quote';

// it's important that this file has a named export called componentBlocks
// schema.Post.ui.views import looks for a named export `componentBlocks`
export const componentBlocks = {
    quote
};

//export default componentBlocks;