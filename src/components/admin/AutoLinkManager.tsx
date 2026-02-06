import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react';

interface KeywordLink {
    keyword: string;
    url: string;
}

interface AutoLinkManagerProps {
    initialLinks?: KeywordLink[];
    onChange: (links: KeywordLink[]) => void;
}

export function AutoLinkManager({ initialLinks = [], onChange }: AutoLinkManagerProps) {
    const [links, setLinks] = React.useState<KeywordLink[]>(initialLinks);
    const [newKeyword, setNewKeyword] = React.useState('');
    const [newUrl, setNewUrl] = React.useState('');

    const addLink = () => {
        if (newKeyword && newUrl) {
            const updatedLinks = [...links, { keyword: newKeyword, url: newUrl }];
            setLinks(updatedLinks);
            onChange(updatedLinks);
            setNewKeyword('');
            setNewUrl('');
        }
    };

    const removeLink = (index: number) => {
        const updatedLinks = links.filter((_, i) => i !== index);
        setLinks(updatedLinks);
        onChange(updatedLinks);
    };

    return (
        <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
            <label className="text-sm font-medium">Automatic Keyword Links</label>
            <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                    <Input
                        placeholder="Keyword (e.g. 'Productivity')"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        className="flex-1"
                    />
                    <Input
                        placeholder="URL (e.g. https://...)"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="flex-1"
                    />
                    <Button type="button" onClick={addLink} size="icon">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-2 mt-4">
                    {links.map((link, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded bg-background">
                            <LinkIcon className="h-3 w-3 text-muted-foreground" />
                            <div className="flex-1 text-sm">
                                <span className="font-semibold">{link.keyword}</span>
                                <span className="mx-2 text-muted-foreground">→</span>
                                <span className="text-blue-500 truncate">{link.url}</span>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                onClick={() => removeLink(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
