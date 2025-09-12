'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Users, 
  FileText, 
  Calendar,
  Search,
  Filter
} from 'lucide-react'
import Link from 'next/link'

interface TemplateCharacter {
  id: string
  name: string
  description?: string
  gender: string
  ageRange?: string
  vocalRange?: string
  notes?: string
}

interface TemplateAuditionMaterial {
  id: string
  type: string
  fileName: string
  fileUrl: string
  fileSize?: number
  mimeType?: string
}

interface ShowTemplate {
  id: string
  name: string
  description?: string
  title?: string
  showDescription?: string
  director?: string
  organization?: string
  location?: string
  contactEmail?: string
  contactPhone?: string
  characters: TemplateCharacter[]
  auditionMaterials: TemplateAuditionMaterial[]
  createdAt: string
  updatedAt: string
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<ShowTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<ShowTemplate | null>(null)
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    title: '',
    showDescription: '',
    director: '',
    organization: '',
    location: '',
    contactEmail: '',
    contactPhone: '',
  })

  // Fetch templates
  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  // Create template from current show data
  const handleCreateTemplate = async () => {
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTemplate)
      })

      if (response.ok) {
        await fetchTemplates()
        setIsCreateDialogOpen(false)
        setNewTemplate({
          name: '',
          description: '',
          title: '',
          showDescription: '',
          director: '',
          organization: '',
          location: '',
          contactEmail: '',
          contactPhone: '',
        })
      }
    } catch (error) {
      console.error('Error creating template:', error)
    }
  }

  // Delete template
  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchTemplates()
      }
    } catch (error) {
      console.error('Error deleting template:', error)
    }
  }

  // Use template to create new show
  const handleUseTemplate = (template: ShowTemplate) => {
    // Navigate to show creation with template data
    const templateData = {
      title: template.title || '',
      description: template.showDescription || '',
      director: template.director || '',
      organization: template.organization || '',
      location: template.location || '',
      contactEmail: template.contactEmail || '',
      contactPhone: template.contactPhone || '',
      characters: template.characters.map(char => ({
        id: `char-${Date.now()}-${Math.random()}`,
        name: char.name,
        description: char.description || '',
        gender: char.gender,
        ageRange: char.ageRange || '',
        vocalRange: char.vocalRange || '',
        notes: char.notes || '',
      })),
      auditionMaterials: {}
    }

    // Store template data in sessionStorage for the create page to use
    sessionStorage.setItem('templateData', JSON.stringify(templateData))
    window.location.href = '/dashboard/shows/create'
  }

  // Filter templates based on search term
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Show Templates</h1>
        </div>
        <div className="text-center py-8">
          <p>Loading templates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Show Templates</h1>
          <p className="text-muted-foreground">
            Save and reuse show configurations for future productions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>
                Create a reusable template for your shows
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="templateName">Template Name *</Label>
                  <Input
                    id="templateName"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Musical Template"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="templateDescription">Description</Label>
                  <Input
                    id="templateDescription"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this template"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defaultTitle">Default Show Title</Label>
                <Input
                  id="defaultTitle"
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Default title for shows using this template"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defaultDescription">Default Show Description</Label>
                <Textarea
                  id="defaultDescription"
                  value={newTemplate.showDescription}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, showDescription: e.target.value }))}
                  placeholder="Default description for shows using this template"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultDirector">Default Director</Label>
                  <Input
                    id="defaultDirector"
                    value={newTemplate.director}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, director: e.target.value }))}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultOrganization">Default Organization</Label>
                  <Input
                    id="defaultOrganization"
                    value={newTemplate.organization}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, organization: e.target.value }))}
                    placeholder="Theater company name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultLocation">Default Location</Label>
                  <Input
                    id="defaultLocation"
                    value={newTemplate.location}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Audition location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultEmail">Default Contact Email</Label>
                  <Input
                    id="defaultEmail"
                    type="email"
                    value={newTemplate.contactEmail}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="your-email@example.com"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTemplate} disabled={!newTemplate.name}>
                  Create Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No templates found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'No templates match your search.' : 'Create your first template to get started.'}
                </p>
              </div>
              {!searchTerm && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    {template.description && (
                      <CardDescription>{template.description}</CardDescription>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Template Info */}
                <div className="space-y-2 text-sm">
                  {template.title && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Default Title:</span>
                      <span>{template.title}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Characters:</span>
                    <Badge variant="outline">{template.characters.length}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Created:</span>
                    <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Characters Preview */}
                {template.characters.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Characters:</h4>
                    <div className="space-y-1">
                      {template.characters.slice(0, 3).map((character) => (
                        <div key={character.id} className="text-xs text-muted-foreground">
                          • {character.name} ({character.gender})
                        </div>
                      ))}
                      {template.characters.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{template.characters.length - 3} more...
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleUseTemplate(template)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


