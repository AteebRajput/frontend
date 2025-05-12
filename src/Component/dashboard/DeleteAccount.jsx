import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  UserX, 
  AlertTriangle, 
  Download, 
  Lock,
  CheckCircle,
  Loader2
} from 'lucide-react';

const DeleteAccount = () => {
  const navigate = useNavigate();
  
  // State management
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  
  // Form states
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [reason, setReason] = useState('');
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const [confirmText, setConfirmText] = useState('');
  
  // Error states
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const reasons = [
    { id: 'not-using', label: 'No longer using the platform' },
    { id: 'alternative', label: 'Found a better alternative' },
    { id: 'technical', label: 'Technical issues' },
    { id: 'privacy', label: 'Privacy concerns' },
    { id: 'other', label: 'Other' }
  ];

  // Simulate data export
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create sample export data
      const exportData = {
        accountInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          joinDate: '2024-01-01'
        },
        transactions: [
          { id: 1, date: '2024-01-15', amount: 500 },
          { id: 2, date: '2024-01-16', amount: 750 }
        ]
      };

      // Create and download file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'account-data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExportComplete(true);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Validate password
  const validatePassword = () => {
    let isValid = true;
    setPasswordError('');
    setConfirmError('');

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  // Handle step progression
  const handleNextStep = () => {
    if (step === 2 && !validatePassword()) {
      return;
    }
    setStep(prev => prev + 1);
  };

  // Handle final deletion
  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      setConfirmError('Please type DELETE to confirm');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log deletion reason and feedback
      console.log('Deletion reason:', reason);
      console.log('Additional feedback:', additionalFeedback);
      
      // Navigate to logout or home page
      navigate('/logout');
    } catch (error) {
      console.error('Deletion failed:', error);
      setIsDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning: Account Deletion</AlertTitle>
        <AlertDescription>
          This action is permanent and cannot be undone. All your data, including order history,
          transaction records, and business information will be permanently removed.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <UserX className="w-6 h-6" />
            <span>Delete Account</span>
          </CardTitle>
          <CardDescription>
            Please follow the steps below to delete your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Step 1: Export Data */}
            <div className={`space-y-4 ${step !== 1 && 'opacity-50'}`}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  1
                </div>
                <h3 className="text-lg font-semibold">Export Your Data</h3>
              </div>
              
              <div className="ml-10">
                <p className="text-gray-600 mb-4">
                  We recommend downloading a copy of your data before proceeding.
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleExportData}
                  disabled={step !== 1 || isExporting}
                  className="w-full sm:w-auto"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : exportComplete ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Download Again
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Export My Data
                    </>
                  )}
                </Button>
                {step === 1 && (
                  <Button 
                    onClick={() => setStep(2)} 
                    className="ml-2"
                  >
                    Skip
                  </Button>
                )}
              </div>
            </div>

            {/* Step 2: Provide Feedback */}
            <div className={`space-y-4 ${step !== 2 && 'opacity-50'}`}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  2
                </div>
                <h3 className="text-lg font-semibold">Tell Us Why</h3>
              </div>
              
              <div className="ml-10">
                <div className="space-y-4">
                  {reasons.map((r) => (
                    <div key={r.id} className="flex items-center">
                      <input
                        type="radio"
                        id={r.id}
                        name="reason"
                        value={r.id}
                        checked={reason === r.id}
                        onChange={(e) => setReason(e.target.value)}
                        disabled={step !== 2}
                        className="mr-2"
                      />
                      <label htmlFor={r.id}>{r.label}</label>
                    </div>
                  ))}
                  
                  {reason && (
                    <Textarea
                      placeholder="Would you like to provide any additional feedback? (optional)"
                      value={additionalFeedback}
                      onChange={(e) => setAdditionalFeedback(e.target.value)}
                      disabled={step !== 2}
                      className="mt-4"
                    />
                  )}
                </div>
                
                {step === 2 && (
                  <div className="mt-4">
                    <Button 
                      onClick={handleNextStep}
                      disabled={!reason}
                    >
                      Continue
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Final Confirmation */}
            <div className={`space-y-4 ${step !== 3 && 'opacity-50'}`}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  3
                </div>
                <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              </div>
              
              <div className="ml-10">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Enter your password
                    </label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={step !== 3}
                      className="mt-1"
                    />
                    {passwordError && (
                      <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm password
                    </label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={step !== 3}
                      className="mt-1"
                    />
                    {confirmError && (
                      <p className="text-sm text-red-500 mt-1">{confirmError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Type DELETE to confirm
                    </label>
                    <Input
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      disabled={step !== 3}
                      className="mt-1"
                    />
                  </div>

                  {step === 3 && (
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deleting Account...
                        </>
                      ) : (
                        'Delete Account'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>
              There was an error deleting your account. Please try again later or contact support.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsDialogOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteAccount;