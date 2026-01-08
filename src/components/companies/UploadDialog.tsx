import { useState } from 'react'
import { UploadIcon, FileSpreadsheetIcon, AlertCircleIcon } from 'lucide-react'
// UI
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// APIs
import { useUploadExcel, type UploadExcelResponse } from '@/apis/companies'
// Utils
import { cn } from '@/lib/utils'

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadResult, setUploadResult] = useState<UploadExcelResponse | null>(
    null,
  )

  const uploadExcel = useUploadExcel()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setError(null)
    setUploadResult(null)

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
    ]

    if (!allowedTypes.includes(selectedFile.type)) {
      setError(
        'Invalid file type. Only Excel (.xlsx, .xls) and CSV files are allowed.',
      )
      setFile(null)
      return
    }

    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.')
      setFile(null)
      return
    }

    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.')
      return
    }

    try {
      setError(null)
      const result = await uploadExcel.mutateAsync(file)
      setUploadResult(result)
    } catch (err: any) {
      setError(
        err?.response?.data?.error || err?.message || 'Failed to upload file',
      )
    }
  }

  const handleClose = () => {
    if (!uploadExcel.isPending) {
      setFile(null)
      setError(null)
      setUploadResult(null)
      onOpenChange(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setError(null)
    setUploadResult(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Companies from Excel</DialogTitle>
          <DialogDescription>
            Upload an Excel or CSV file to create multiple companies at once.
            The file should contain company data with the required columns.
          </DialogDescription>
        </DialogHeader>

        {!uploadResult ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Select File</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  disabled={uploadExcel.isPending}
                  className="cursor-pointer"
                />
              </div>
              {file && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileSpreadsheetIcon className="h-4 w-4" />
                  <span>{file.name}</span>
                  <span className="text-xs">
                    ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="rounded-md bg-muted p-4 text-sm">
              <p className="font-semibold mb-2">Required columns:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>nameEn (Company name in English)</li>
                <li>registrationNumber</li>
                <li>industry</li>
                <li>address</li>
                <li>city</li>
                <li>countryCode or country (Country code or name)</li>
                <li>phone</li>
                <li>email</li>
              </ul>
              <p className="font-semibold mt-3 mb-2">Optional columns:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  nameAr, legalForm, foundedDate, size, website, description,
                  services
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className={cn(
                'rounded-md p-4',
                uploadResult.data.failed > 0
                  ? 'bg-yellow-50 dark:bg-yellow-950/20'
                  : 'bg-green-50 dark:bg-green-950/20',
              )}
            >
              <div className="space-y-2">
                <p className="font-semibold">
                  {uploadResult.message || 'Upload completed'}
                </p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total</p>
                    <p className="font-semibold">{uploadResult.data.total}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Success</p>
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      {uploadResult.data.success}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Failed</p>
                    <p className="font-semibold text-red-600 dark:text-red-400">
                      {uploadResult.data.failed}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {uploadResult.data.errors.length > 0 && (
              <div className="max-h-60 overflow-y-auto rounded-md border p-4">
                <p className="font-semibold mb-2 text-sm">Errors:</p>
                <div className="space-y-2">
                  {uploadResult.data.errors.map((error, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">Row {error.row}:</span>{' '}
                      <span className="text-muted-foreground">
                        {error.error}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {uploadResult ? (
            <>
              <Button variant="outline" onClick={handleReset}>
                Upload Another
              </Button>
              <Button onClick={handleClose}>Close</Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={uploadExcel.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!file || uploadExcel.isPending}
              >
                {uploadExcel.isPending ? (
                  'Uploading...'
                ) : (
                  <>
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
