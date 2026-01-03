import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, LogOut, User, Mail, Calendar, CheckCircle2, Lock, Copy, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SignOutConfirmModal } from '@/components/modals/SignOutConfirmModal';
export default function Profile() {
    const navigate = useNavigate();
    const { user, logout, updateUserProfile, deleteAccount, resetPassword, updateUserPassword } = useAuth();

    const [displayName, setDisplayName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({});

    useEffect(() => {
        if (user?.displayName) {
            setDisplayName(user.displayName);
        }
    }, [user]);

    const validateForm = () => {
        const newErrors = {};

        if (!displayName.trim()) {
            newErrors.displayName = 'Name is required';
        } else if (displayName.trim().length < 2) {
            newErrors.displayName = 'Name must be at least 2 characters';
        }

        return newErrors;
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            await updateUserProfile({
                displayName: displayName.trim(),
            });

            toast.success('Profile updated successfully!');
            setIsEditing(false);
            setErrors({});
        } catch (error) {
            toast.error('Failed to update profile');
            setErrors({ submit: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            toast.error('Failed to logout');
        }
    };

    const handleDeleteAccount = async () => {
        setIsLoading(true);
        try {
            await deleteAccount();
            toast.success('Account deleted');
            navigate('/signup');
        } catch (error) {
            toast.error('Failed to delete account');
        } finally {
            setIsLoading(false);
        }
    };

    const validatePasswordForm = () => {
        const newErrors = {};

        if (!oldPassword) {
            newErrors.oldPassword = 'Current password is required';
        }

        if (!newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])/.test(newPassword)) {
            newErrors.newPassword = 'Password must contain lowercase letters';
        } else if (!/(?=.*[A-Z])/.test(newPassword)) {
            newErrors.newPassword = 'Password must contain uppercase letters';
        } else if (!/(?=.*\d)/.test(newPassword)) {
            newErrors.newPassword = 'Password must contain numbers';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        const newErrors = validatePasswordForm();
        if (Object.keys(newErrors).length > 0) {
            setPasswordErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            await updateUserPassword(oldPassword, newPassword);
            toast.success('Password updated successfully!');
            setShowResetPasswordForm(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordErrors({});
        } catch (error) {
            toast.error('Failed to update password');
            setPasswordErrors({ submit: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(user?.email || '');
        toast.success('Email copied to clipboard');
    };

    if (!user) {
        return (
            <AppLayout>
                <div className="p-6 text-center">
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
                    <p className="text-muted-foreground">Manage your account settings</p>
                </div>

                {/* Profile Info Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
                    {/* User Avatar */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">{user.displayName || 'User'}</h2>
                            <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                <Mail className="w-4 h-4" />
                                {user.email}
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t" />

                    {/* Account Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Account Information</h3>

                        <div className="grid gap-4">
                            {/* Email (Read-only) */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email Address
                                </Label>
                                <Input
                                    value={user.email}
                                    disabled
                                    className="bg-slate-50"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Email cannot be changed. Contact support for assistance.
                                </p>
                            </div>

                            {/* Display Name */}
                            {isEditing ? (
                                <div className="space-y-2">
                                    <Label htmlFor="displayName" className="text-sm font-semibold text-foreground">
                                        Full Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="displayName"
                                        value={displayName}
                                        onChange={(e) => {
                                            setDisplayName(e.target.value);
                                            if (errors.displayName) setErrors({ ...errors, displayName: undefined });
                                        }}
                                        className={errors.displayName ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                        placeholder="Your full name"
                                    />
                                    {errors.displayName && (
                                        <div className="flex items-center gap-2 text-red-500 text-xs">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.displayName}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Full Name
                                    </Label>
                                    <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                                        <p className="text-foreground">{displayName || 'Not set'}</p>
                                    </div>
                                </div>
                            )}

                            {/* Account Created */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Account Created
                                </Label>
                                <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                                    <p className="text-foreground text-sm">
                                        {new Date(user.metadata?.createdAt || new Date()).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {errors.submit && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                                <p className="text-red-700 text-sm">{errors.submit}</p>
                            </div>
                        )}

                        {/* Edit/Save Buttons */}
                        {isEditing ? (
                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setDisplayName(user.displayName || '');
                                        setErrors({});
                                    }}
                                    disabled={isLoading}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    onClick={handleUpdateProfile}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Save Changes
                                        </div>
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(true)}
                                className="w-full"
                            >
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </div>

                {/* User ID Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">User Information</h3>
                        <p className="text-sm text-muted-foreground">
                            Your unique user identifier
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">User ID (Email)</Label>
                        <div className="flex gap-2">
                            <Input
                                value={user?.email || ''}
                                disabled
                                className="bg-slate-50 flex-1"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={copyToClipboard}
                                title="Copy to clipboard"
                            >
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            This is your unique identifier. Use it for support or account recovery.
                        </p>
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Security</h3>
                        <p className="text-sm text-muted-foreground">
                            Manage your account security settings
                        </p>
                    </div>

                    {!showResetPasswordForm ? (
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => setShowResetPasswordForm(true)}
                        >
                            <Lock className="w-4 h-4 mr-2" />
                            Change Password
                        </Button>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            {/* Old Password */}
                            <div className="space-y-2">
                                <Label htmlFor="oldPassword" className="text-sm font-semibold">
                                    Current Password <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="oldPassword"
                                        type={showOldPassword ? 'text' : 'password'}
                                        placeholder="Enter your current password"
                                        value={oldPassword}
                                        onChange={(e) => {
                                            setOldPassword(e.target.value);
                                            if (passwordErrors.oldPassword) setPasswordErrors({ ...passwordErrors, oldPassword: undefined });
                                        }}
                                        className={passwordErrors.oldPassword ? 'border-red-500 focus-visible:ring-red-500 pr-10' : 'pr-10'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {passwordErrors.oldPassword && (
                                    <div className="flex items-center gap-2 text-red-500 text-xs">
                                        <AlertCircle className="w-3 h-3" />
                                        {passwordErrors.oldPassword}
                                    </div>
                                )}
                            </div>

                            {/* New Password */}
                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-sm font-semibold">
                                    New Password <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a strong password"
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            if (passwordErrors.newPassword) setPasswordErrors({ ...passwordErrors, newPassword: undefined });
                                        }}
                                        className={passwordErrors.newPassword ? 'border-red-500 focus-visible:ring-red-500 pr-10' : 'pr-10'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {newPassword && (
                                    <div className="flex gap-1 h-1">
                                        {[...Array(4)].map((_, i) => {
                                            let strength = 0;
                                            if (newPassword.length >= 8) strength++;
                                            if (/(?=.*[a-z])/.test(newPassword)) strength++;
                                            if (/(?=.*[A-Z])/.test(newPassword)) strength++;
                                            if (/(?=.*\d)/.test(newPassword)) strength++;
                                            return (
                                                <div
                                                    key={i}
                                                    className={`flex-1 rounded-full transition-colors ${i < strength
                                                        ? strength === 4
                                                            ? 'bg-green-500'
                                                            : strength === 3
                                                                ? 'bg-yellow-500'
                                                                : 'bg-orange-500'
                                                        : 'bg-slate-200'
                                                        }`}
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                                {passwordErrors.newPassword && (
                                    <div className="flex items-center gap-2 text-red-500 text-xs">
                                        <AlertCircle className="w-3 h-3" />
                                        {passwordErrors.newPassword}
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-semibold">
                                    Confirm Password <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (passwordErrors.confirmPassword) setPasswordErrors({ ...passwordErrors, confirmPassword: undefined });
                                        }}
                                        className={passwordErrors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500 pr-10' : 'pr-10'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {confirmPassword && newPassword === confirmPassword && (
                                    <div className="flex items-center gap-2 text-green-600 text-xs">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Passwords match
                                    </div>
                                )}
                                {passwordErrors.confirmPassword && (
                                    <div className="flex items-center gap-2 text-red-500 text-xs">
                                        <AlertCircle className="w-3 h-3" />
                                        {passwordErrors.confirmPassword}
                                    </div>
                                )}
                            </div>

                            {/* Error Message */}
                            {passwordErrors.submit && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                                    <p className="text-red-700 text-sm">{passwordErrors.submit}</p>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        setShowResetPasswordForm(false);
                                        setOldPassword('');
                                        setNewPassword('');
                                        setConfirmPassword('');
                                        setPasswordErrors({});
                                    }}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Updating...
                                        </div>
                                    ) : (
                                        'Update Password'
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 rounded-2xl border border-red-200 p-8 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
                        <p className="text-sm text-red-700">
                            These actions cannot be undone. Please proceed with caution.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {/* <Button
                            variant="outline"
                            className="w-full justify-start border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={handleLogout}
                            disabled={isLoading}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Log Out
                        </Button> */}

                        <Button
                            variant="outline"
                            className="w-full justify-start border-red-300 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={isLoading}
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>

                {/* Delete Account Confirmation Modal */}
                {showDeleteConfirm &&
                    createPortal(
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
                            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full">
                                <div className="p-6 space-y-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-red-600 mb-2">Delete Account?</h2>
                                        <p className="text-muted-foreground text-sm mb-2">
                                            This action is permanent and cannot be undone.
                                        </p>
                                        {/* <p className="text-red-700 text-sm font-medium">
                                            All your account data, expenses, and settings will be permanently deleted.
                                        </p> */}
                                    </div>
{/* 
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-red-800 text-sm">
                                            <strong>Warning:</strong> This includes all your financial records and group memberships.
                                        </p>
                                    </div> */}

                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-sm font-semibold text-foreground">
                                                Type "delete" to confirm
                                            </Label>
                                            <Input
                                                type="text"
                                                placeholder='Type "delete"'
                                                value={deleteConfirmText}
                                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => {
                                                setShowDeleteConfirm(false);
                                                setDeleteConfirmText('');
                                            }}
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                            onClick={handleDeleteAccount}
                                            disabled={isLoading || deleteConfirmText !== 'delete'}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Deleting...
                                                </div>
                                            ) : (
                                                'Delete Account'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )
                }

                <SignOutConfirmModal
                    isOpen={showSignOutConfirm}
                    isLoading={isLoading}
                    onConfirm={handleLogout}
                    onCancel={() => setShowSignOutConfirm(false)}
                />
            </div>
        </AppLayout>
    );
}
