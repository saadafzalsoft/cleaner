import connectToDatabase from './mongodb';
import ServiceModel from '@/models/Service';
import SuburbModel from '@/models/Suburb';
import FaqModel from '@/models/Faq';
import TestimonialModel from '@/models/Testimonial';
import BlogPostModel from '@/models/BlogPost';
import GalleryItemModel from '@/models/GalleryItem';
import VideoItemModel from '@/models/VideoItem';
import SiteSettingsModel from '@/models/SiteSettings';

import { SERVICES, FAQS, BLOG_POSTS, GALLERY_IMAGES, VIDEOS_LIST, BUSINESS_INFO } from '@/data/canberraData';
import { ACT_SUBURBS, REVIEWS } from '@/data/cleaningData';

function normalizeService(doc: any) {
  const fallback = SERVICES.find((s) => s.slug === doc?.slug);
  const name = doc?.name || doc?.title || fallback?.name || 'Cleaning Service';
  return {
    ...doc,
    ...(doc?._id ? { _id: doc._id.toString() } : {}),
    name,
    title: doc?.title || name,
    navTitle: doc?.navTitle || name,
    shortDesc: doc?.shortDesc || fallback?.shortDesc || '',
    fullDesc: doc?.fullDesc || fallback?.fullDesc || doc?.shortDesc || '',
    image: doc?.image || fallback?.image || '/pictures/real_image_1.jpeg',
    differentiators: Array.isArray(doc?.differentiators)
      ? doc.differentiators
      : (fallback?.differentiators ?? []),
    processSteps: Array.isArray(doc?.processSteps)
      ? doc.processSteps
      : (fallback?.processSteps ?? []),
    pricingNotes: Array.isArray(doc?.pricingNotes)
      ? doc.pricingNotes
      : (fallback?.pricingNotes ?? []),
  };
}

export async function getPublicServices() {
  try {
    await connectToDatabase();
    const docs = await ServiceModel.find({ published: true }).sort({ displayOrder: 1, createdAt: -1 }).lean();
    if (docs && docs.length > 0) {
      return docs.map((d: any) => normalizeService(d));
    }
  } catch (err) {
    console.warn('[PublicData] Error reading services from DB, fallback to default:', err);
  }
  return SERVICES.map((s: any) => normalizeService(s));
}

export async function getServiceBySlug(slug: string) {
  try {
    await connectToDatabase();
    const doc = await ServiceModel.findOne({ slug, published: true }).lean();
    if (doc) {
      return normalizeService(doc);
    }
  } catch (err) {
    console.warn('[PublicData] Error reading service slug from DB:', err);
  }
  const fallback = SERVICES.find((s) => s.slug === slug);
  if (!fallback) return null;
  return normalizeService(fallback);
}

export async function getPublicSuburbs() {
  try {
    await connectToDatabase();
    const docs = await SuburbModel.find().sort({ displayOrder: 1, name: 1 }).lean();
    if (docs && docs.length > 0) {
      return docs.map((d: any) => ({ ...d, _id: d._id.toString() }));
    }
  } catch (err) {
    console.warn('[PublicData] Error reading suburbs from DB:', err);
  }
  return ACT_SUBURBS;
}

export async function getPublicFaqs() {
  try {
    await connectToDatabase();
    const docs = await FaqModel.find().sort({ displayOrder: 1, createdAt: -1 }).lean();
    if (docs && docs.length > 0) {
      return docs.map((d: any) => ({ ...d, _id: d._id.toString() }));
    }
  } catch (err) {
    console.warn('[PublicData] Error reading faqs from DB:', err);
  }
  return FAQS;
}

export async function getPublicTestimonials() {
  try {
    await connectToDatabase();
    const docs = await TestimonialModel.find({ published: true }).sort({ displayOrder: 1, createdAt: -1 }).lean();
    if (docs && docs.length > 0) {
      return docs.map((d: any) => ({ ...d, _id: d._id.toString() }));
    }
  } catch (err) {
    console.warn('[PublicData] Error reading testimonials from DB:', err);
  }
  return REVIEWS;
}

export async function getPublicBlogPosts() {
  try {
    await connectToDatabase();
    const docs = await BlogPostModel.find({ published: true }).sort({ displayOrder: 1, createdAt: -1 }).lean();
    if (docs && docs.length > 0) {
      return docs.map((d: any) => ({ ...d, _id: d._id.toString() }));
    }
  } catch (err) {
    console.warn('[PublicData] Error reading blog posts from DB:', err);
  }
  return BLOG_POSTS;
}

export async function getBlogPostBySlug(slug: string) {
  try {
    await connectToDatabase();
    const doc = await BlogPostModel.findOne({ slug, published: true }).lean();
    if (doc) {
      return { ...doc, _id: (doc as any)._id.toString() };
    }
  } catch (err) {
    console.warn('[PublicData] Error reading blog post slug from DB:', err);
  }
  return BLOG_POSTS.find((b) => b.slug === slug) || null;
}

export async function getPublicGalleryItems() {
  try {
    await connectToDatabase();
    const docs = await GalleryItemModel.find({ published: true }).sort({ displayOrder: 1, createdAt: -1 }).lean();
    if (docs && docs.length > 0) {
      return docs.map((d: any) => ({ ...d, _id: d._id.toString() }));
    }
  } catch (err) {
    console.warn('[PublicData] Error reading gallery from DB:', err);
  }
  return GALLERY_IMAGES;
}

export async function getPublicVideos() {
  try {
    await connectToDatabase();
    const docs = await VideoItemModel.find({ published: true }).sort({ displayOrder: 1, createdAt: -1 }).lean();
    if (docs && docs.length > 0) {
      return docs.map((d: any) => ({ ...d, _id: d._id.toString() }));
    }
  } catch (err) {
    console.warn('[PublicData] Error reading videos from DB:', err);
  }
  return VIDEOS_LIST;
}

export async function getPublicSiteSettings() {
  try {
    await connectToDatabase();
    const doc = await SiteSettingsModel.findOne().lean();
    if (doc) {
      return { ...doc, _id: (doc as any)._id.toString() };
    }
  } catch (err) {
    console.warn('[PublicData] Error reading site settings from DB:', err);
  }
  return BUSINESS_INFO;
}
