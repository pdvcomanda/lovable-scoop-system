
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Receipt, ReceiptProps } from "@/components/ui/receipt";
import { useState, useRef } from "react";

interface ConfirmPrintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptProps;
}

export const ConfirmPrintDialog = ({
  isOpen,
  onClose,
  receiptData,
}: ConfirmPrintDialogProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  
  const handlePrint = () => {
    setIsPrinting(true);
    
    // Timeout to allow state to update before printing
    setTimeout(() => {
      const content = receiptRef.current;
      if (!content) return;
      
      const printWindow = window.open('', '', 'height=600,width=800');
      if (!printWindow) {
        console.error('Não foi possível abrir a janela de impressão');
        setIsPrinting(false);
        return;
      }
      
      printWindow.document.write('<html><head><title>Cupom de Venda</title>');
      printWindow.document.write('<style>');
      printWindow.document.write('body { font-family: monospace; width: 80mm; margin: 0; padding: 0; }');
      printWindow.document.write('div { margin: 0; padding: 0; }');
      printWindow.document.write('</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(content.outerHTML);
      printWindow.document.write('</body></html>');
      
      printWindow.document.close();
      printWindow.focus();
      
      // Print and close
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        setIsPrinting(false);
        onClose();
      }, 500);
    }, 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isPrinting && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Impressão de Cupom</DialogTitle>
          <DialogDescription>
            Confira os dados do cupom e clique em imprimir para enviar para a impressora.
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-auto">
          <Receipt ref={receiptRef} {...receiptData} printable />
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPrinting}
          >
            Fechar
          </Button>
          <Button 
            onClick={handlePrint}
            disabled={isPrinting}
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            {isPrinting ? "Imprimindo..." : "Imprimir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
