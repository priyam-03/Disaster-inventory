import ArticlesList from '../../components/article_list';
import { redirect } from 'next/navigation'
import { authOptions } from '../../lib/AuthOptions'
import { getServerSession } from 'next-auth'
import LogoutBtn from '@/components/LogoutBtn'
export default async function ArticlesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/signin') 
    // Or wherever your login page is
  }
  return (
    <main className="max-w-4xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">Filtered Articles</h1>
      <ArticlesList />
      
    </main>
  );
}