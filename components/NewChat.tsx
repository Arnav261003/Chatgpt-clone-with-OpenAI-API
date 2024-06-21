'use client';

import { db } from '@/firebase';
import { PlusIcon } from '@heroicons/react/24/solid'
import { create } from 'domain';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'; //We use serverTimestamp to set the timestamp on the server and not personal which can mess things up.
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; //It will import default from next/router but we need to change it to next/navigation
import React from 'react'

const NewChat = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const createNewChat = async() => {
    const doc = await addDoc(
      collection(db, 'users', session?.user?.email!, 'chats'), {
        userId: session?.user?.email!,
        createdAt: serverTimestamp()
      });

      router.push(`/chat/${doc.id}`)
  }

  return (
    <div onClick={createNewChat} className='border-gray-700 border chatRow'>
        <PlusIcon className='h-4 w-4'/>
        <p>New Chat</p>
    </div>
  )
}

export default NewChat