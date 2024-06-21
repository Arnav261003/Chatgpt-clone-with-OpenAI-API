'use client';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import React, { FormEvent, useState } from 'react';
import { Props } from './ChatInput';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import toast from 'react-hot-toast';

export const ChatInput = ({ chatId }: Props) => {
    const [prompt, setPrompt] = useState('');
    const { data: session } = useSession();

    //TODO: useSWR to get model
    const model = 'gpt-3.5-turbo';

    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!prompt) return;

        const input = prompt.trim();
        setPrompt('');

        const message: Message = {
            text: input,
            createdAt: serverTimestamp(),
            user: {
                _id: session?.user?.email!,
                name: session?.user?.name!,
                avatar: session?.user?.image! || `https://ui-avatars.com/api/?name=${session?.user?.name}`,
            }
        };

        await addDoc(
            collection(db, 'users', session?.user?.email!, 'chats', chatId, 'messages'), 
            message
        );

        //Toast notification to say loading

        const notification = toast.loading('Let me think...');

        await fetch('/api/askQuestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: input, chatId, model, session
            }),
        }).then(() => {
            //Toast notification to say successful!
            toast.success('I have spoken!', {
                id: notification,
            })
        })
    };



    return (
        <div className='bg-gray-700/50 text-gray-400 rounded-lg text-sm'>
            <form onClick={sendMessage} className='p-5 flex items-center space-x-3 disabled:cursor-not-allowed disabled:text-gray-300'>
                <input
                    disabled={!session}
                    className='bg-transparent flex-1 focus:outline-none'
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    type='text'
                    placeholder='Type your message here...' />
                <button
                    disabled={!prompt || !session}
                    type="submit"
                    className='bg-[#11a37f] hover:opacity-50 text-white font-bold px-4 py-2 rounded disabled:bg-gray-600 disabled:cursor-not-allowed'>
                    <PaperAirplaneIcon className='h-4 w-4 -rotate-45' />
                </button>
            </form>

            <div>
                {/* ModelSelection */}
            </div>
        </div>
    );
};
