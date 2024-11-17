import { Send } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

export default function ChatInput({inputRef, setMessages}){
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const origin = import.meta.env.ORIGIN

  const handleSend = async (e) => {
    e.preventDefault()
    if(input.length > 0){
      setThinking(true)
      const response = await fetch(`${origin}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: `text:-${input}`
        })
      })
      const r = await response.json()
      setThinking(false)
      setInput('')
      setMessages(r.res)
    }
  }

    return (
      <div className="p-4 border-t bg-background">
        <form
          className="flex items-center space-x-2"
        >
          <Input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about your travel plans..."
            className="flex-1 rounded-md"
           />
          <Button disabled={thinking} onClick={handleSend} type="submit" size="icon" className="rounded-full">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    )
}