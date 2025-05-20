
import { useState, useEffect, useRef } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

interface ConfirmPrintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptProps;
}

interface PrinterDevice {
  id: string;
  name: string;
}

export const ConfirmPrintDialog = ({
  isOpen,
  onClose,
  receiptData,
}: ConfirmPrintDialogProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printers, setPrinters] = useState<PrinterDevice[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string>("");
  
  // Fetch available printers
  useEffect(() => {
    if (isOpen) {
      // In a real production environment, you would use a library
      // that can detect printers, such as print.js or a native integration
      // For demonstration, we'll simulate some printers
      
      // Simulate API call to get printers
      const fetchPrinters = async () => {
        try {
          // This would be replaced by actual printer detection
          // For Stone and Getnet integration, you would use their SDKs
          
          // Simulated printers
          const availablePrinters = [
            { id: 'thermal1', name: 'Impressora Térmica (USB)' },
            { id: 'hp1', name: 'HP LaserJet P1102' },
            { id: 'epson1', name: 'Epson TM-T20' },
            { id: 'generic1', name: 'Impressora Genérica' },
          ];
          
          setPrinters(availablePrinters);
          
          // Select the first printer by default
          if (availablePrinters.length > 0) {
            setSelectedPrinter(availablePrinters[0].id);
          }
        } catch (error) {
          console.error('Erro ao buscar impressoras:', error);
          toast.error('Não foi possível detectar impressoras');
        }
      };
      
      fetchPrinters();
    }
  }, [isOpen]);
  
  const handlePrint = () => {
    if (!selectedPrinter) {
      toast.error('Selecione uma impressora para continuar');
      return;
    }
    
    setIsPrinting(true);
    
    // Timeout to allow state to update before printing
    setTimeout(() => {
      const content = receiptRef.current;
      if (!content) return;
      
      // Log selected printer (in production, this would send to the selected printer)
      console.log(`Imprimindo no dispositivo: ${selectedPrinter}`);
      
      const printWindow = window.open('', '', 'height=600,width=800');
      if (!printWindow) {
        console.error('Não foi possível abrir a janela de impressão');
        setIsPrinting(false);
        return;
      }
      
      printWindow.document.write('<html><head><title>Cupom de Venda</title>');
      printWindow.document.write('<style>');
      printWindow.document.write('body { font-family: monospace; width: 80mm; margin: 0; padding: 10px; }');
      printWindow.document.write('div { margin: 0; padding: 0; }');
      printWindow.document.write('.printer-info { font-size: 10px; text-align: center; margin-bottom: 10px; color: #999; }');
      printWindow.document.write('</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(`<div class="printer-info">Imprimindo em: ${printers.find(p => p.id === selectedPrinter)?.name || selectedPrinter}</div>`);
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
        
        // Notification of successful printing
        toast.success(`Cupom enviado para impressora ${printers.find(p => p.id === selectedPrinter)?.name || selectedPrinter}`);
      }, 500);
    }, 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isPrinting && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Impressão de Cupom</DialogTitle>
          <DialogDescription>
            Confira os dados do cupom e selecione uma impressora para continuar.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="printer-select">Selecione a impressora</Label>
            <Select 
              value={selectedPrinter} 
              onValueChange={setSelectedPrinter}
              disabled={printers.length === 0}
            >
              <SelectTrigger id="printer-select">
                <SelectValue placeholder="Selecione uma impressora" />
              </SelectTrigger>
              <SelectContent>
                {printers.map((printer) => (
                  <SelectItem key={printer.id} value={printer.id}>
                    {printer.name}
                  </SelectItem>
                ))}
                {printers.length === 0 && (
                  <SelectItem value="none" disabled>
                    Nenhuma impressora encontrada
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="max-h-[40vh] overflow-auto border rounded-md p-2">
            <Receipt ref={receiptRef} {...receiptData} printable />
          </div>
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
            disabled={isPrinting || !selectedPrinter}
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
