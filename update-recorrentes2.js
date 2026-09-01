import fs from 'fs';
let code = fs.readFileSync('src/components/RecorrentesPage.tsx', 'utf-8');

if (!code.includes("import { CalculadoraSalario }")) {
  code = code.replace(
    "import { Plus, Search, Calendar, ChevronLeft, ChevronRight, Filter, Wallet, MoreVertical, CreditCard, Tag as TagIcon, X, Check, Eye, EyeOff, FileText, ArrowUpRight, ArrowDownRight, Edit2, Trash2, Library, Copy, Landmark, Settings, CheckCircle2 } from 'lucide-react';",
    "import { Plus, Search, Calendar, ChevronLeft, ChevronRight, Filter, Wallet, MoreVertical, CreditCard, Tag as TagIcon, X, Check, Eye, EyeOff, FileText, ArrowUpRight, ArrowDownRight, Edit2, Trash2, Library, Copy, Landmark, Settings, CheckCircle2 } from 'lucide-react';\nimport { CalculadoraSalario } from './CalculadoraSalario';"
  );
}

const mainLayoutStr = "{/* MAIN LAYOUT WRAPPER FOR LIST AND PROJEÇÃO */}";

if (!code.includes("{filtroNatureza === 'salario' ? (")) {
  code = code.replace(
    mainLayoutStr,
    `{filtroNatureza === 'salario' ? (
        <div className="mt-8">
          <CalculadoraSalario activeProfileId={activeProfileId} />
        </div>
      ) : (
      <>
      ${mainLayoutStr}`
  );
  
  // need to close the tag at the bottom.
  // The layout wrapper ends before {isPlanejarModalOpen &&
  const modalStr = "{isPlanejarModalOpen && (";
  code = code.replace(
    modalStr,
    `</>
      )}
      
      ${modalStr}`
  );
}

fs.writeFileSync('src/components/RecorrentesPage.tsx', code);
