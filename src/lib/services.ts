import { supabase } from './supabase';
import type { Book, Author, Article, Category, Tag, Page, PopupAd, Message, Skill } from './types';

export const bookService = {
    async getAll(): Promise<Book[]> {
        const { data, error } = await supabase
            .from('books')
            .select(`
        *,
        categories(name),
        authors:book_authors(authors(*)),
        tags:book_tags(tags(name))
      `)
            .order('id', { ascending: false });

        if (error) throw error;

        return data.map(book => ({
            ...book,
            category: book.categories?.name,
            authors: book.authors.map((a: any) => a.authors.name),
            authorIds: book.authors.map((a: any) => a.authors.id),
            tags: book.tags.map((t: any) => t.tags.name),
            coverImage: book.cover_image_url,
            purchaseUrls: book.purchase_urls,
            slug: book.slug || book.id.toString(),
            faq: book.faq
        }));
    },

    async getById(id: number | string): Promise<Book | null> {
        const { data, error } = await supabase
            .from('books')
            .select(`
        *,
        categories(name),
        authors:book_authors(authors(*)),
        tags:book_tags(tags(name))
      `)
            .eq('id', id)
            .single();

        if (error) return null;

        return {
            ...data,
            category: data.categories?.name,
            authors: data.authors.map((a: any) => a.authors.name),
            authorIds: data.authors.map((a: any) => a.authors.id),
            tags: data.tags.map((t: any) => t.tags.name),
            coverImage: data.cover_image_url,
            purchaseUrls: data.purchase_urls,
            slug: data.slug || data.id.toString(),
            faq: data.faq
        };
    },

    async getBySlug(slug: string): Promise<Book | null> {
        const { data, error } = await supabase
            .from('books')
            .select(`
        *,
        categories(name),
        authors:book_authors(authors(*)),
        tags:book_tags(tags(name))
      `)
            .eq('slug', slug)
            .single();

        if (error) {
            // Fallback to ID if slug is numeric
            if (!isNaN(Number(slug))) {
                return this.getById(slug);
            }
            return null;
        }

        return {
            ...data,
            category: data.categories?.name,
            authors: data.authors.map((a: any) => a.authors.name),
            authorIds: data.authors.map((a: any) => a.authors.id),
            tags: data.tags.map((t: any) => t.tags.name),
            coverImage: data.cover_image_url,
            purchaseUrls: data.purchase_urls,
            slug: data.slug,
            faq: data.faq
        };
    },

    async create(book: Omit<Book, 'id'>): Promise<Book> {
        const { data: categoryData } = await supabase
            .from('categories')
            .select('id')
            .eq('name', book.category)
            .single();

        if (!categoryData) {
            throw new Error(`Category "${book.category}" not found. Please ensure the database is seeded with categories.`);
        }

        const { data, error } = await supabase
            .from('books')
            .insert({
                title: book.title,
                slug: book.slug || book.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                cover_image_url: book.coverImage,
                review: book.review,
                purchase_urls: book.purchaseUrls,
                category_id: categoryData?.id,
                quotes: book.quotes,
                featured: book.featured,
                faq: book.faq,
            })
            .select()
            .single();

        if (error) throw error;

        if (book.authorIds?.length) {
            await supabase.from('book_authors').insert(
                book.authorIds.map(authorId => ({ book_id: data.id, author_id: authorId }))
            );
        }

        if (book.tags?.length) {
            const { data: tagsData } = await supabase.from('tags').select('id, name').in('name', book.tags);
            if (tagsData?.length) {
                await supabase.from('book_tags').insert(
                    tagsData.map(t => ({ book_id: data.id, tag_id: t.id }))
                );
            }
        }

        return (await this.getById(data.id)) as Book;
    },

    async update(id: number, book: Partial<Book>): Promise<Book> {
        const updateData: any = {};
        if (book.title !== undefined) updateData.title = book.title;
        if (book.coverImage !== undefined) updateData.cover_image_url = book.coverImage;
        if (book.review !== undefined) updateData.review = book.review;
        if (book.purchaseUrls !== undefined) updateData.purchase_urls = book.purchaseUrls;
        if (book.quotes !== undefined) updateData.quotes = book.quotes;
        if (book.featured !== undefined) updateData.featured = book.featured;
        if (book.faq !== undefined) updateData.faq = book.faq;

        if (book.category) {
            const { data: categoryData } = await supabase
                .from('categories')
                .select('id')
                .eq('name', book.category)
                .single();
            if (categoryData) updateData.category_id = categoryData.id;
        }

        const { error } = await supabase.from('books').update(updateData).eq('id', id);
        if (error) throw error;

        if (book.authorIds) {
            await supabase.from('book_authors').delete().eq('book_id', id);
            if (book.authorIds.length) {
                await supabase.from('book_authors').insert(
                    book.authorIds.map(authorId => ({ book_id: id, author_id: authorId }))
                );
            }
        }

        if (book.tags) {
            await supabase.from('book_tags').delete().eq('book_id', id);
            const { data: tagsData } = await supabase.from('tags').select('id, name').in('name', book.tags);
            if (tagsData?.length) {
                await supabase.from('book_tags').insert(
                    tagsData.map(t => ({ book_id: id, tag_id: t.id }))
                );
            }
        }

        return (await this.getById(id)) as Book;
    },

    async delete(id: number): Promise<void> {
        const { error } = await supabase.from('books').delete().eq('id', id);
        if (error) throw error;
    }
};

export const authorService = {
    async getAll(): Promise<Author[]> {
        const { data, error } = await supabase.from('authors').select('*').order('name');
        if (error) throw error;
        return data.map(a => ({
            ...a,
            image: a.image_url,
            slug: a.slug || a.id.toString()
        }));
    },

    async getById(id: number | string): Promise<Author | null> {
        const { data, error } = await supabase.from('authors').select('*').eq('id', id).single();
        if (error) return null;
        return {
            ...data,
            image: data.image_url,
            slug: data.slug || data.id.toString()
        };
    },

    async getBySlug(slug: string): Promise<Author | null> {
        const { data, error } = await supabase.from('authors').select('*').eq('slug', slug).single();
        if (error) {
            // Fallback to ID if slug is numeric or not found
            if (!isNaN(Number(slug))) {
                return this.getById(slug);
            }
            return null;
        }
        return {
            ...data,
            image: data.image_url,
            slug: data.slug || data.id.toString()
        };
    },

    async create(author: Omit<Author, 'id'>): Promise<Author> {
        const { data, error } = await supabase
            .from('authors')
            .insert({
                name: author.name,
                slug: author.slug || author.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                bio: author.bio,
                image_url: author.image
            })
            .select()
            .single();

        if (error) throw error;
        return { ...data, image: data.image_url };
    },

    async update(id: number, author: Partial<Author>): Promise<Author> {
        const updateData: any = {};
        if (author.name) updateData.name = author.name;
        if (author.slug) updateData.slug = author.slug;
        if (author.bio) updateData.bio = author.bio;
        if (author.image) updateData.image_url = author.image;

        const { data, error } = await supabase
            .from('authors')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return { ...data, image: data.image_url };
    },

    async delete(id: number): Promise<void> {
        const { error } = await supabase.from('authors').delete().eq('id', id);
        if (error) throw error;
    }
};

export const categoryService = {
    async getAll(): Promise<Category[]> {
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (error) throw error;
        return data.map(c => ({
            id: c.id,
            name: c.name,
            slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            description: c.description || `Curated ${c.name} books and guides to help you master the skill.`,
            icon: c.icon,
            pillarContent: c.pillar_content,
            coverImage: c.cover_image_url
        }));
    },

    async getBySlug(slug: string): Promise<Category | null> {
        // First try to find by slug column
        const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single();

        if (error) {
            // Fallback: find by matching name-derived slug
            const allCategories = await this.getAll();
            const match = allCategories.find(c => c.slug === slug);
            return match || null;
        }

        return {
            id: data.id,
            name: data.name,
            slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            description: data.description || `Curated ${data.name} books and guides to help you master the skill.`,
            icon: data.icon,
            pillarContent: data.pillar_content,
            coverImage: data.cover_image_url
        };
    },

    async getByName(name: string): Promise<Category | null> {
        const { data, error } = await supabase.from('categories').select('*').eq('name', name).single();
        if (error) return null;
        return {
            id: data.id,
            name: data.name,
            slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            description: data.description || `Curated ${data.name} books and guides to help you master the skill.`,
            icon: data.icon,
            pillarContent: data.pillar_content,
            coverImage: data.cover_image_url
        };
    },

    async getWithBooks(slug: string): Promise<{ category: Category; books: Book[] } | null> {
        const category = await this.getBySlug(slug);
        if (!category) return null;

        const books = await bookService.getAll();
        const categoryBooks = books.filter(book => book.category === category.name);

        return { category, books: categoryBooks };
    },

    async create(category: Omit<Category, 'id'>): Promise<Category> {
        const { data, error } = await supabase.from('categories').insert({
            name: category.name,
            slug: category.slug,
            description: category.description,
            icon: category.icon,
            pillar_content: category.pillarContent,
            cover_image_url: category.coverImage
        }).select().single();
        if (error) throw error;
        return {
            id: data.id,
            name: data.name,
            slug: data.slug,
            description: data.description,
            icon: data.icon,
            pillarContent: data.pillar_content,
            coverImage: data.cover_image_url
        };
    },

    async update(id: number, category: Partial<Category>): Promise<Category> {
        const updateData: any = {};
        if (category.name) updateData.name = category.name;
        if (category.slug) updateData.slug = category.slug;
        if (category.description) updateData.description = category.description;
        if (category.icon !== undefined) updateData.icon = category.icon;
        if (category.pillarContent !== undefined) updateData.pillar_content = category.pillarContent;
        if (category.coverImage !== undefined) updateData.cover_image_url = category.coverImage;

        const { data, error } = await supabase.from('categories').update(updateData).eq('id', id).select().single();
        if (error) throw error;
        return {
            id: data.id,
            name: data.name,
            slug: data.slug,
            description: data.description,
            icon: data.icon,
            pillarContent: data.pillar_content,
            coverImage: data.cover_image_url
        };
    },

    async delete(id: number): Promise<void> {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
    }
};

export const articleService = {
    async getAll(): Promise<Article[]> {
        const { data, error } = await supabase.from('articles').select('*').order('date', { ascending: false });
        if (error) throw error;
        return data.map(a => ({
            ...a,
            coverImage: a.cover_image_url,
            author: a.author_name,
            skillSlug: a.skill_slug,
            articleRole: a.article_role,
            keywordLinks: a.keyword_links || [],
            metaTitle: a.meta_title,
            metaDescription: a.meta_description
        }));
    },

    async getBySkill(skillSlug: string): Promise<Article[]> {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('skill_slug', skillSlug)
            .order('date', { ascending: false });

        if (error) throw error;
        return data.map(a => ({
            ...a,
            coverImage: a.cover_image_url,
            author: a.author_name,
            skillSlug: a.skill_slug,
            articleRole: a.article_role,
            keywordLinks: a.keyword_links || [],
            metaTitle: a.meta_title,
            metaDescription: a.meta_description
        }));
    },

    async getBySlug(slug: string): Promise<Article | null> {
        const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();
        if (error) return null;
        return {
            ...data,
            coverImage: data.cover_image_url,
            author: data.author_name,
            skillSlug: data.skill_slug,
            articleRole: data.article_role,
            keywordLinks: data.keyword_links || [],
            metaTitle: data.meta_title,
            metaDescription: data.meta_description
        };
    },

    async create(article: Article): Promise<Article> {
        const { data, error } = await supabase
            .from('articles')
            .insert({
                slug: article.slug,
                title: article.title,
                excerpt: article.excerpt,
                content: article.content,
                cover_image_url: article.coverImage,
                author_name: article.author,
                date: article.date,
                skill_slug: article.skillSlug,
                article_role: article.articleRole,
                keyword_links: article.keywordLinks,
                meta_title: article.metaTitle,
                meta_description: article.metaDescription
            })
            .select()
            .single();

        if (error) throw error;
        return {
            ...data,
            coverImage: data.cover_image_url,
            author: data.author_name,
            skillSlug: data.skill_slug,
            articleRole: data.article_role,
            keywordLinks: data.keyword_links || [],
            metaTitle: data.meta_title,
            metaDescription: data.meta_description
        };
    },

    async update(slug: string, article: Partial<Article>): Promise<Article> {
        const updateData: any = {};
        if (article.title) updateData.title = article.title;
        if (article.excerpt) updateData.excerpt = article.excerpt;
        if (article.content) updateData.content = article.content;
        if (article.coverImage) updateData.cover_image_url = article.coverImage;
        if (article.author) updateData.author_name = article.author;
        if (article.date) updateData.date = article.date;
        if (article.skillSlug !== undefined) updateData.skill_slug = article.skillSlug;
        if (article.articleRole !== undefined) updateData.article_role = article.articleRole;
        if (article.keywordLinks !== undefined) updateData.keyword_links = article.keywordLinks;
        if (article.metaTitle !== undefined) updateData.meta_title = article.metaTitle;
        if (article.metaDescription !== undefined) updateData.meta_description = article.metaDescription;

        const { data, error } = await supabase
            .from('articles')
            .update(updateData)
            .eq('slug', slug)
            .select()
            .single();

        if (error) throw error;
        return {
            ...data,
            coverImage: data.cover_image_url,
            author: data.author_name,
            skillSlug: data.skill_slug,
            articleRole: data.article_role,
            keywordLinks: data.keyword_links || [],
            metaTitle: data.meta_title,
            metaDescription: data.meta_description
        };
    },

    async delete(slug: string): Promise<void> {
        const { error } = await supabase.from('articles').delete().eq('slug', slug);
        if (error) throw error;
    }
};

export const skillService = {
    async getAll(): Promise<Skill[]> {
        const { data, error } = await supabase.from('skills').select('*').order('name');
        if (error) throw error;
        return data.map(s => ({
            ...s,
            pillarContent: s.pillar_content,
            coverImage: s.cover_image_url
        }));
    },

    async getBySlug(slug: string): Promise<Skill | null> {
        const { data, error } = await supabase.from('skills').select('*').eq('slug', slug).single();
        if (error) return null;
        return {
            ...data,
            pillarContent: data.pillar_content,
            coverImage: data.cover_image_url
        };
    },

    async getWithBooks(slug: string): Promise<{ skill: Skill; books: Book[] } | null> {
        const skill = await this.getBySlug(slug);
        if (!skill) return null;

        const books = await bookService.getAll();
        // Filter books where the category name matches the skill name
        // This assumes a convention where Skill Name == Category Name
        const skillBooks = books.filter(book => book.category === skill.name);

        return { skill, books: skillBooks };
    },

    async getWithArticles(slug: string): Promise<{ skill: Skill; articles: Article[] } | null> {
        const skill = await this.getBySlug(slug);
        if (!skill) return null;

        const articles = await articleService.getBySkill(slug);
        return { skill, articles };
    },

    async create(skill: Omit<Skill, 'id'>): Promise<Skill> {
        const { data, error } = await supabase
            .from('skills')
            .insert({
                slug: skill.slug,
                name: skill.name,
                description: skill.description,
                pillar_content: skill.pillarContent,
                cover_image_url: skill.coverImage,
                icon: skill.icon
            })
            .select()
            .single();

        if (error) throw error;
        return {
            ...data,
            pillarContent: data.pillar_content,
            coverImage: data.cover_image_url
        };
    },

    async update(slug: string, skill: Partial<Skill>): Promise<Skill> {
        const updateData: any = {};
        if (skill.name) updateData.name = skill.name;
        if (skill.description) updateData.description = skill.description;
        if (skill.pillarContent) updateData.pillar_content = skill.pillarContent;
        if (skill.coverImage) updateData.cover_image_url = skill.coverImage;
        if (skill.icon !== undefined) updateData.icon = skill.icon;

        const { data, error } = await supabase
            .from('skills')
            .update(updateData)
            .eq('slug', slug)
            .select()
            .single();

        if (error) throw error;
        return {
            ...data,
            pillarContent: data.pillar_content,
            coverImage: data.cover_image_url
        };
    },

    async delete(slug: string): Promise<void> {
        const { error } = await supabase.from('skills').delete().eq('slug', slug);
        if (error) throw error;
    }
};

export const pageService = {
    async getAll(): Promise<Page[]> {
        const { data, error } = await supabase.from('pages').select('*').order('title');
        if (error) throw error;
        return data.map(p => ({
            ...p,
            structuredContent: p.structured_content
        }));
    },

    async getBySlug(slug: string): Promise<Page | null> {
        const { data, error } = await supabase.from('pages').select('*').eq('slug', slug).single();
        if (error) return null;
        return {
            ...data,
            structuredContent: data.structured_content
        };
    },

    async create(page: Page): Promise<Page> {
        const { data, error } = await supabase
            .from('pages')
            .insert({
                slug: page.slug,
                title: page.title,
                content: page.content,
                structured_content: page.structuredContent
            })
            .select()
            .single();

        if (error) throw error;
        return { ...data, structuredContent: data.structured_content };
    },

    async update(slug: string, page: Partial<Page>): Promise<Page> {
        const updateData: any = {};
        if (page.title) updateData.title = page.title;
        if (page.content) updateData.content = page.content;
        if (page.structuredContent) updateData.structured_content = page.structuredContent;

        const { data, error } = await supabase
            .from('pages')
            .update(updateData)
            .eq('slug', slug)
            .select()
            .single();

        if (error) throw error;
        return { ...data, structuredContent: data.structured_content };
    },

    async delete(slug: string): Promise<void> {
        const { error } = await supabase.from('pages').delete().eq('slug', slug);
        if (error) throw error;
    }
};

export const popupAdService = {
    async getAll(): Promise<PopupAd[]> {
        const { data, error } = await supabase.from('popup_ads').select('*').order('id', { ascending: false });
        if (error) throw error;
        return data.map(ad => ({
            ...ad,
            displayDelay: ad.display_delay,
            displayDuration: ad.display_duration,
            isActive: ad.is_active
        }));
    },

    async getActive(): Promise<PopupAd[]> {
        const { data, error } = await supabase.from('popup_ads').select('*').eq('is_active', true);
        if (error) throw error;
        return data.map(ad => ({
            ...ad,
            displayDelay: ad.display_delay,
            displayDuration: ad.display_duration,
            isActive: ad.is_active
        }));
    },

    async create(ad: Omit<PopupAd, 'id'>): Promise<PopupAd> {
        const { data, error } = await supabase
            .from('popup_ads')
            .insert({
                name: ad.name,
                content: ad.content,
                display_delay: ad.displayDelay,
                display_duration: ad.displayDuration,
                is_active: ad.isActive
            })
            .select()
            .single();

        if (error) throw error;
        return {
            ...data,
            displayDelay: data.display_delay,
            displayDuration: data.display_duration,
            isActive: data.is_active
        };
    },

    async update(id: number, ad: Partial<PopupAd>): Promise<PopupAd> {
        const updateData: any = {};
        if (ad.name) updateData.name = ad.name;
        if (ad.content) updateData.content = ad.content;
        if (ad.displayDelay !== undefined) updateData.display_delay = ad.displayDelay;
        if (ad.displayDuration !== undefined) updateData.display_duration = ad.displayDuration;
        if (ad.isActive !== undefined) updateData.is_active = ad.isActive;

        const { data, error } = await supabase
            .from('popup_ads')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return {
            ...data,
            displayDelay: data.display_delay,
            displayDuration: data.display_duration,
            isActive: data.is_active
        };
    },

    async delete(id: number): Promise<void> {
        const { error } = await supabase.from('popup_ads').delete().eq('id', id);
        if (error) throw error;
    }
};

export const tagService = {
    async getAll(): Promise<Tag[]> {
        const { data, error } = await supabase.from('tags').select('*').order('name');
        if (error) throw error;
        return data;
    },

    async create(tag: Omit<Tag, 'id'>): Promise<Tag> {
        const { data, error } = await supabase.from('tags').insert(tag).select().single();
        if (error) throw error;
        return data;
    },

    async update(id: number, tag: Partial<Tag>): Promise<Tag> {
        const { data, error } = await supabase.from('tags').update(tag).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    async delete(id: number): Promise<void> {
        const { error } = await supabase.from('tags').delete().eq('id', id);
        if (error) throw error;
    }
};

export const userService = {
    async getByEmail(email: string): Promise<any> {
        const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
        if (error) return null;
        return data;
    },

    async getAll(): Promise<any[]> {
        const { data, error } = await supabase.from('users').select('*').order('name');
        if (error) throw error;
        return data;
    },

    async create(user: any): Promise<any> {
        const response = await fetch('/api/admin/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create user');
        }

        return await response.json();
    },

    async update(id: number, user: any): Promise<any> {
        const response = await fetch('/api/admin/users', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, ...user }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update user');
        }

        return await response.json();
    },

    async delete(id: number): Promise<void> {
        const response = await fetch(`/api/admin/users?id=${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete user');
        }
    }
};


export const settingsService = {
    async get(key: string): Promise<any> {
        const { data, error } = await supabase.from('settings').select('value').eq('key', key).single();
        if (error) return null;
        return data.value;
    },

    async getAll(): Promise<Record<string, any>> {
        const { data, error } = await supabase.from('settings').select('*');
        if (error) throw error;

        const settingsMap: Record<string, any> = {};
        data.forEach(item => {
            settingsMap[item.key] = item.value;
        });
        return settingsMap;
    },

    async upsert(key: string, value: any): Promise<any> {
        const { data, error } = await supabase
            .from('settings')
            .upsert({ key, value, updated_at: new Date().toISOString() })
            .select()
            .single();

        if (error) throw error;
        return data.value;
    }
};

export const messagesService = {
    async getAll(): Promise<Message[]> {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getUnreadCount(): Promise<number> {
        const { count, error } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('is_read', false);

        if (error) throw error;
        return count || 0;
    },

    async markAsRead(id: number): Promise<void> {
        const { error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('id', id);

        if (error) throw error;
    },

    async delete(id: number): Promise<void> {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
