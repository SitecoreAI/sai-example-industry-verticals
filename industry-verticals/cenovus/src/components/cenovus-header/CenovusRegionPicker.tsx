'use client';

import { demoRegionGroups, type DemoRegion } from '@/lib/cenovus-demo';
import { cn } from '@/shadcn/lib/utils';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import React, { JSX, ReactNode } from 'react';

export type CenovusRegionPickerProps = {
  regionOpen: boolean;
  onRegionToggle: () => void;
  selectedRegion: string;
  onSelectRegion: (region: DemoRegion) => void;
  /** Light label before the bold selection (e.g. “Choose your region:”). */
  prefix: ReactNode;
};

/** Utility-bar region control: grouped list with checkbox-style single selection. */
export function CenovusRegionPicker({
  regionOpen,
  onRegionToggle,
  selectedRegion,
  onSelectRegion,
  prefix,
}: CenovusRegionPickerProps): JSX.Element {
  return (
    <div className="relative">
      <button
        type="button"
        className="text-foreground-light hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
        aria-expanded={regionOpen}
        aria-haspopup="listbox"
        onClick={onRegionToggle}
      >
        <span className="text-foreground-light">{prefix}</span>
        <span className="text-foreground font-semibold">{selectedRegion}</span>
        {regionOpen ? (
          <ChevronUp className="size-4 shrink-0 opacity-70" aria-hidden />
        ) : (
          <ChevronDown className="size-4 shrink-0 opacity-70" aria-hidden />
        )}
      </button>
      {regionOpen && (
        <div
          className="border-border absolute left-0 z-50 mt-1 min-w-[15rem] rounded-md border bg-[var(--color-background)] py-2 shadow-md"
          role="listbox"
          aria-label="Region"
        >
          {demoRegionGroups.map((group) => (
            <div key={group.label} role="presentation">
              <div
                className="text-foreground px-3 pt-2 pb-1 text-sm font-semibold"
                id={`cenovus-region-group-${group.label}`}
              >
                {group.label}
              </div>
              <ul
                className="pb-1"
                role="group"
                aria-labelledby={`cenovus-region-group-${group.label}`}
              >
                {group.regions.map((r) => {
                  const selected = r === selectedRegion;
                  return (
                    <li key={r} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className={cn(
                          'flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors',
                          selected
                            ? 'text-foreground bg-transparent'
                            : 'text-foreground-light hover:bg-[var(--color-background-accent)]/40'
                        )}
                        onClick={() => onSelectRegion(r)}
                      >
                        <span
                          className={cn(
                            'flex size-4 shrink-0 items-center justify-center rounded-sm border',
                            selected
                              ? 'border-neutral-700 bg-neutral-700'
                              : 'border-neutral-300 bg-transparent'
                          )}
                          aria-hidden
                        >
                          {selected ? (
                            <Check className="size-3 text-white" strokeWidth={3} />
                          ) : null}
                        </span>
                        <span
                          className={
                            selected ? 'font-medium text-[var(--color-foreground)]' : undefined
                          }
                        >
                          {r}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
