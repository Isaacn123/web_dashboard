'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { 
  CheckIcon,
  DocumentTextIcon, 
  PlusIcon, 
  HomeIcon,
  UserGroupIcon,
  CogIcon,
  ChartBarIcon,
  BellIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

import dynamic from 'next/dynamic';
   const CreateArticleClient = dynamic(() => import('./CreateArticleClient'), { ssr: false });

   export default function CreateArticlePage() {
     return <CreateArticleClient />;
   }