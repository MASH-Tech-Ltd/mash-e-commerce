import { Suspense } from 'react';
import Footer from '../../components/layout/Footer';
import SearchClient from './SearchClient';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <SearchClient />
      </Suspense>
      <Footer />
    </div>
  );
}
