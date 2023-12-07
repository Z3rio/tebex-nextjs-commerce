'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import CloseLogin from './close-login';
import OpenLogin from './open-login';

export default function LoginModal({ authLink }: { authLink: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const openLogin = () => setIsOpen(true);
  const closeLogin = () => setIsOpen(false);

  return (
    <>
      <button aria-label="Open login" onClick={openLogin}>
        <OpenLogin />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeLogin} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-400"
            enterFrom="scale-0"
            enterTo="scale-1"
            leave="transition-all ease-in-out duration-300"
            leaveFrom="scale-1"
            leaveTo="scale-0"
          >
            <Dialog.Panel className="fixed left-1/2 top-1/2 flex h-fit max-h-[90vh] w-full -translate-x-1/2 -translate-y-1/2 flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl dark:border-neutral-700 dark:bg-black/80 dark:text-white md:w-[390px]">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Login</p>

                <button aria-label="Close login" onClick={closeLogin}>
                  <CloseLogin />
                </button>
              </div>

              <a href={authLink}>
                <button>Open auth link</button>
              </a>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
