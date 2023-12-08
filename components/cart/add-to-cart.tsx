'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { PackageType } from '@lib/tebex/types';
import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import LoadingDots from 'components/loading-dots';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';

  return (
    <button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      aria-label="Add to cart"
      aria-disabled={pending}
      className={clsx(buttonClasses, {
        'hover:opacity-90': true,
        disabledClasses: pending
      })}
    >
      <div className="absolute left-0 ml-4">
        {pending ? <LoadingDots className="mb-3 bg-white" /> : <PlusIcon className="h-5" />}
      </div>
      Add To Cart
    </button>
  );
}

export function AddToCart({
  packageId,
  packageType
}: {
  packageId: string;
  packageType: PackageType;
}) {
  const [message, formAction] = useFormState(addItem, null);
  const actionWithVariant = formAction.bind(null, {
    packageId,
    packageType
  });

  useEffect(() => {
    if (message && message !== true) {
      enqueueSnackbar(message.toString(), {
        variant: 'error',
        autoHideDuration: 5000
      });
    }
  }, [message]);

  return (
    <>
      <SnackbarProvider />
      <form action={actionWithVariant}>
        <SubmitButton />
      </form>
    </>
  );
}
