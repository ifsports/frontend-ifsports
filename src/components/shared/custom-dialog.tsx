import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function CustomDialog({ open, onClose, title, children, className = "max-w-[42.438rem] w-full p-8 bg-[#F5F6FA] max-md:w-screen max-md:max-w-full max-md:m-0 max-h-[90vh] overflow-y-auto" }: CustomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(openState) => !openState && onClose()}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-title text-[#062601]">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2 flex flex-col gap-6">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}