import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';

export function SignOutConfirmModal({ isOpen, isLoading, onConfirm, onCancel }) {
    if (!isOpen) return null;

    const modal = (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full">
                <div className="p-6 space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground mb-2">Sign Out?</h2>
                        <p className="text-muted-foreground text-sm">
                            Are you sure you want to sign out of your account?
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-destructive hover:bg-destructive/90 text-white"
                            onClick={onConfirm}
                            disabled={isLoading}
                        >
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}
