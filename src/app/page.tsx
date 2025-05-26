'use client';

import { ApiHealth } from '@/types/apiHealth';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { formatDate } from '@/helpers/formatDate';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiHealthRes, setApiHealthRes] = useState<ApiHealth[] | null>(null);

  const checkHealth = async () => {
    setIsLoading(true);
    const res = await fetch(`/api/healthCheck`);
    const data = await res.json();
    setApiHealthRes(data);
    setIsLoading(false);
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="p-10 min-h-screen">
      <div className="m-auto">
        <h1 className="text-center font-bold text-3xl mb-8">Ambiente Consolare</h1>
        {isLoading && <span>carregando...</span>}
        {!isLoading && apiHealthRes && <ApiHealthTable apiHealthRes={apiHealthRes} />}
      </div>
    </div>
  );
}

function ApiHealthTable({ apiHealthRes }: { apiHealthRes: ApiHealth[] }) {
  return (
    <Table>
      <TableCaption>
        <small className="text-slate-500 font-bold">
          Saúde das apis {formatDate(new Date(), { withHours: true })}
        </small>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Api</TableHead>
          <TableHead className="text-center">Saúde</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apiHealthRes.map((api) => (
          <TableRow key={api.apiName}>
            <TableCell className="font-medium">{api.apiName}</TableCell>
            <TableCell className="justify-center flex items-center gap-4">
              <HealthStatusIcon healthy={api.healthy} />
              {api.healthy ? 'saudável' : 'não saudável'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function HealthStatusIcon({ healthy }: { healthy: boolean }) {
  return (
    <div
      className={`border-2 border-transparent min-w-3 min-h-3 rounded-full ${
        healthy ? 'bg-green-500' : 'bg-red-500'
      }`}
    />
  );
}
