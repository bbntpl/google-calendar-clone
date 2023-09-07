import React from 'react'

export default function SectionText({ text }: { text: string }) {
  return <h1 className='section-text'>
    {text}
  </h1>
}