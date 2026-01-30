import { cn } from '@/lib/utils';

interface ChainConnectorProps {
  isValid: boolean;
}

export function ChainConnector({ isValid }: ChainConnectorProps) {
  return (
    <div className="flex items-center justify-center px-2">
      <div className="relative">
        {/* Main connector line */}
        <div
          className={cn(
            'w-12 h-0.5 transition-colors duration-300',
            isValid ? 'bg-valid' : 'bg-invalid'
          )}
        />
        {/* Arrow head */}
        <div
          className={cn(
            'absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0',
            'border-t-[6px] border-t-transparent',
            'border-b-[6px] border-b-transparent',
            'border-l-[8px]',
            isValid ? 'border-l-valid' : 'border-l-invalid'
          )}
        />
        {/* Glow effect */}
        <div
          className={cn(
            'absolute inset-0 blur-sm',
            isValid ? 'bg-valid/30' : 'bg-invalid/30'
          )}
        />
      </div>
    </div>
  );
}
