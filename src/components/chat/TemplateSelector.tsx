
import React, { useState } from 'react';
import { Template } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TemplateSelectorProps {
  templates: Template[];
  onSelect: (templateContent: string) => void;
  onClose: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  onSelect,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTemplates = templates.filter((template) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      template.title.toLowerCase().includes(searchLower) ||
      template.content.toLowerCase().includes(searchLower) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });
  
  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">Message Templates</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="relative mb-3">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
        {filteredTemplates.map((template) => (
          <Card 
            key={template.id}
            className="p-2 cursor-pointer hover:bg-gray-50 border border-gray-200"
            onClick={() => onSelect(template.content)}
          >
            <CardContent className="p-2">
              <div className="flex items-start space-x-2">
                <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                <div className="flex-grow">
                  <h4 className="text-sm font-medium line-clamp-1">{template.title}</h4>
                  <p className="text-xs text-gray-500 my-1 line-clamp-2">{template.content}</p>
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredTemplates.length === 0 && (
          <div className="col-span-full text-center py-4 text-gray-500 text-sm">
            No templates match your search
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateSelector;
