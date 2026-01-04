
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SocialShareButtonsProps {
  url: string;
  title: string;
}

const TwitterIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const FacebookIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
);
const PinterestIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 0 5.396 0 12.017c0 7.02 6.024 11.42 10.965 10.965.233-.04.42-.234.42-.482 0-.2-.04-.52-.08-.68-.16-.64-.96-3.88-.96-3.88s-.24-.48-.24-1.2c0-1.12.68-1.96 1.52-1.96.72 0 1.08.52 1.08 1.16 0 .72-.44 1.76-.68 2.76-.2 1.28.64 2.32 1.88 2.32 2.24 0 3.96-2.88 3.96-6.4 0-3.32-2.4-5.64-5.64-5.64-3.88 0-6.08 2.88-6.08 5.48 0 .8.28 1.64.64 2.08.08.08.08.16.04.28-.04.12-.16.48-.2.64-.04.12-.12.16-.24.08-1.4-1.04-2.28-3.12-2.28-4.96 0-4.12 3.04-7.44 8.24-7.44 4.44 0 7.84 3.24 7.84 7.24 0 4.6-2.88 8.16-6.96 8.16-1.4 0-2.72-.76-3.16-1.64h-.04c-.28.88-.88 2.2-1.24 2.84-.28.48-.52.88-.84 1.24.52.12 1.04.16 1.56.16 6.64 0 12.017-5.377 12.017-12.017C24.017 5.396 18.656 0 12.017 0z"></path></svg>
);


export function SocialShareButtons({ url, title }: SocialShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Share2 />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 cursor-pointer"
          >
            <TwitterIcon />
            <span>Twitter</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 cursor-pointer"
          >
           <FacebookIcon />
            <span>Facebook</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=&description=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 cursor-pointer"
          >
            <PinterestIcon />
            <span>Pinterest</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
