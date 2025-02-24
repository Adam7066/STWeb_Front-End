import type { GetLearnArticlesRes, LearnCategory } from '~/scripts/fetchInterface'

export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig()

  const learnArticles = useState<Record<string, LearnCategory>>('learnArticles')
  const { data } = await useFetch<GetLearnArticlesRes>(config.public.backendApi + '/learn/articles', {
    method: 'GET',
  })
  if (data.value) learnArticles.value = data.value.data

  const learnArticlesPath = Object.entries(learnArticles.value)
    .flatMap(([categoryKey, category]) =>
      Object.entries(category.topics)
        .flatMap(([topicKey, topic]) =>
          topic.articles.map(article => `${categoryKey}/${topicKey}/${article.filename}`),
        ),
    )

  if (to.path.startsWith('/learn/')) {
    if (!learnArticlesPath.includes(to.path.replace('/learn/', ''))) {
      return navigateTo('/learn')
    }
  }
})