'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { PackageType } from '@lib/tebex/types';
import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import LoadingDots from 'components/loading-dots';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton({ availableForSale }: { availableForSale: boolean }) {
  const { pending } = useFormStatus();
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <button aria-disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

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
  availableForSale,
  packageType
}: {
  packageId: string;
  availableForSale: boolean;
  packageType: PackageType;
}) {
  const [message, formAction] = useFormState(addItem, null);
  const actionWithVariant = formAction.bind(null, {
    packageId,
    packageType
  });

  return (
    <form action={actionWithVariant}>
      <SubmitButton availableForSale={availableForSale} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
