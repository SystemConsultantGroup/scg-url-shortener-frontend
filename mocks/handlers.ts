import { http, HttpResponse } from "msw";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || "https://app.scg.sh";

// Generate 50 mock URLs
const mockUrls = Array.from({ length: 50 }, (_, i) => ({
  urlId: i + 1,
  slug: `mock-link-${i + 1}`,
  targetUrl: `https://example.com/page-${i + 1}`,
  totalClicks: Math.floor(Math.random() * 5000),
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
})).sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
);

export const handlers = [
  // Google OAuth Login
  http.get(`${API_DOMAIN}/api/v1/auth/google`, () => {
    return HttpResponse.json(
      {
        user: {
          email: "user@g.skku.edu",
          name: "Yongwook Lee",
        },
      },
      {
        headers: {
          "Set-Cookie": "accessToken=mocked-token; Path=/; HttpOnly",
        },
      },
    );
  }),

  // Get User Info
  http.get(`${API_DOMAIN}/api/v1/user`, () => {
    return HttpResponse.json({
      user: {
        email: "user@g.skku.edu",
        name: "Yongwook Lee",
      },
    });
  }),

  // Create Short URL
  http.post(`${API_DOMAIN}/api/v1/urls`, async ({ request }) => {
    const { slug, targetUrl } = (await request.json()) as {
      targetUrl: string;
      slug: string;
    };
    const newUrl = {
      urlId: Math.floor(Math.random() * 1000) + 1000,
      slug: slug || `generated-${Math.floor(Math.random() * 1000)}`,
      targetUrl,
      totalClicks: 0,
      createdAt: new Date().toISOString(),
    };
    mockUrls.unshift(newUrl);
    return HttpResponse.json(newUrl);
  }),

  // Get My URL List
  http.get(`${API_DOMAIN}/api/v1/urls`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "5");
    const sort = url.searchParams.get("sort") || "newest";

    const sortedUrls = [...mockUrls];

    // Sorting Logic
    switch (sort) {
      case "oldest":
        sortedUrls.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "most-clicks":
        sortedUrls.sort((a, b) => b.totalClicks - a.totalClicks);
        break;
      case "least-clicks":
        sortedUrls.sort((a, b) => a.totalClicks - b.totalClicks);
        break;
      case "newest":
      default:
        sortedUrls.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }

    // Pagination Logic
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedUrls = sortedUrls.slice(start, end);
    const totalPages = Math.ceil(sortedUrls.length / limit);

    return HttpResponse.json({
      data: paginatedUrls,
      meta: {
        total: sortedUrls.length,
        page,
        limit,
        totalPages,
      },
    });
  }),

  // Update URL
  http.patch(
    `${API_DOMAIN}/api/v1/urls/:urlId`,
    async ({ params, request }) => {
      const { urlId } = params;
      const { slug, targetUrl } = (await request.json()) as {
        targetUrl?: string;
        slug?: string;
      };

      const index = mockUrls.findIndex((u) => u.urlId === Number(urlId));
      if (index !== -1) {
        if (slug) mockUrls[index].slug = slug;
        if (targetUrl) mockUrls[index].targetUrl = targetUrl;
      }

      return HttpResponse.json({
        urlId: Number(urlId),
        shortenedUrl: `https://scg.sh/${slug || mockUrls[index]?.slug}`,
        updatedAt: new Date().toISOString(),
      });
    },
  ),

  // Delete URL
  http.delete(`${API_DOMAIN}/api/v1/urls/:urlId`, ({ params }) => {
    const { urlId } = params;
    const index = mockUrls.findIndex((u) => u.urlId === Number(urlId));
    if (index !== -1) {
      mockUrls.splice(index, 1);
    }
    return new HttpResponse(null, { status: 204 });
  }),

  // Get Statistics
  http.get(`${API_DOMAIN}/api/v1/urls/:slug/analytics`, () => {
    // Generate realistic daily stats for the last 365 days (1 year)
    const dailyStats = Array.from({ length: 365 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (364 - i));
      return {
        date: date.toISOString().split("T")[0],
        count: Math.floor(Math.random() * 50), // Reduced average count for realistic variance over a year
      };
    });

    // Generate realistic hourly stats for the last 24 hours
    const hourlyStats = Array.from({ length: 24 }, (_, i) => {
      const date = new Date();
      date.setHours(date.getHours() - (23 - i));
      return {
        time: date.toISOString(),
        count: Math.floor(Math.random() * 50),
      };
    });

    return HttpResponse.json({
      totalClicks: dailyStats.reduce((acc, curr) => acc + curr.count, 0),
      dailyStats,
      hourlyStats,
    });
  }),
];
