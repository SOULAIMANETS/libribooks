
'use client';

import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const PinterestIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.93 4.43 10.81 10.14 11.63.31.05.67-.19.75-.52l.25-1.54c-.07.01-.15.01-.23.01-4.74 0-8.59-3.85-8.59-8.59S7.26 3.41 12 3.41s8.59 3.85 8.59 8.59c0 .9-.15 1.77-.43 2.59l-.36 1.36-.05.05c.25-.15.57-.52.75-.98.28-.75 1.35-.81 1.49-1.44.67-.25 1.33-.67 1.33-1.5C24 5.37 18.63 0 12 0z"/><circle cx="9" cy="9" r="3"/><path d="M14 20c0-2.2-1.8-4-4-4s-4 1.8-4 4"/></svg>
);
const WhatsAppIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
  </svg>
);
const EmailIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M0 3v18h24V3H0zm6.623 7.929L2 16.641V7.183l4.623 3.746zm1.609 3.469L2.455 20h19.09l-5.777-8.602 1.107-1.108L22 16.64V3H2v13.709l1.609-2.087L12 12.962l3.992 4.034-1.734 1.734z"/>
  </svg>
);
const MessengerIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.552a.59.59 0 01.213.665l-.39 2.182.66-.288a.64.64 0 01.67.055c.96.575 2.097.882 3.287.882 4.8 0 8.692-3.288 8.692-7.342 0-4.054-3.891-7.342-8.691-7.342z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C8.74 0 8.333.015 7.052.072 5.771.126 4.923.26 4.26.516 3.597.772 2.974.944 2.213 1.076 1.452 1.208.57 1.456 0 2.832v17.336c.002 2.554 1.674 3.838 4.475 4.204.552.057.963.137 1.409.23.368.079.716.17 1.308.303.592.143 1.117.296 1.653.53C10.633 24.944 11.133 24.99 12 25s1.367-.046 1.878-.306c.536-.234 1.061-.387 1.653-.53.592-.133.94-.224 1.308-.303.446-.093.857-.173 1.41-.23 2.801-.366 4.473-1.65 4.475-4.204V2.832C23.065 1.456 22.183 1.208 21.422 1.076c-.761-.132-1.384-.304-2.047-.56C18.112.77 17.264.636 15.983.56 14.702.504 14.295 0 12 0zm6.465 18.781c0 1.619-1.096 2.38-3.626 2.629-.488.052-.972.144-1.469.235-.997.185-1.956.36-2.719.489-.763.129-1.302.27-1.807.433C9.015 22.71 8.577 22.89 8 23.071 7.423 23.252 6.955 23.43 6.465 23.78c0 0-11.355-2-7.93-2s3-10 3-10a5.972 5.972 0 012.048.835c.548.366.886.732 1.884.958.998.226 2.047.305 2.913.367.866.062 1.436.12 2.077.179.641.059 1.26.169 1.936.299.676.13 1.352.29 2.048.54C16.915 17.8 16.987 18.181 16.965 18.781z"/>
  </svg>
);
const CopyIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);


export function SocialShareButtons({ url, title }: SocialShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

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
          >
            Twitter
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=&description=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Pinterest
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`mailto:?subject=${encodedTitle}&body=${encodedTitle}%20${encodedUrl}`}
          >
            Email
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=1234567890&display=popup`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Messenger
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://www.instagram.com/direct/new/?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram DM
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
