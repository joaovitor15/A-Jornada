import fs from 'fs';
let code = fs.readFileSync('src/components/CardFaturaDashboard.tsx', 'utf-8');

code = code.replace(
  'interface CardFaturaDashboardProps {\n  activeProfileId: string;\n  setActivePage?: (page: string) => void;\n}',
  'interface CardFaturaDashboardProps {\n  activeProfileId: string;\n  setActivePage?: (page: string) => void;\n  mesSelecionado?: number;\n  anoSelecionado?: number;\n}'
);

code = code.replace(
  'export function CardFaturaDashboard({ activeProfileId, setActivePage }: CardFaturaDashboardProps) {',
  'export function CardFaturaDashboard({ activeProfileId, setActivePage, mesSelecionado, anoSelecionado }: CardFaturaDashboardProps) {'
);

const effectCode = `  const [viewingOffset, setViewingOffset] = useState(0);

  useEffect(() => {
    if (mesSelecionado && anoSelecionado) {
      const today = new Date();
      const diff = (anoSelecionado - today.getFullYear()) * 12 + (mesSelecionado - (today.getMonth() + 1));
      setViewingOffset(diff);
    }
  }, [mesSelecionado, anoSelecionado]);`;

code = code.replace(
  'const [viewingOffset, setViewingOffset] = useState(0);',
  effectCode
);

fs.writeFileSync('src/components/CardFaturaDashboard.tsx', code);
