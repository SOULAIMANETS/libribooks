
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralSettingsForm } from '@/components/admin/GeneralSettingsForm';
import { SeoSettingsForm } from '@/components/admin/SeoSettingsForm';
import { UrlsAndRoutingSettingsForm } from '@/components/admin/UrlsAndRoutingSettingsForm';
import { AppearanceSettingsForm } from '@/components/admin/AppearanceSettingsForm';
import { IntegrationsSettingsForm } from '@/components/admin/IntegrationsSettingsForm';


export default function SettingsPage() {

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 max-w-2xl">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
        <TabsTrigger value="routing">URLs & Routing</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Manage your site's basic information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <GeneralSettingsForm />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="appearance">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of your application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AppearanceSettingsForm />
          </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="seo">
        <Card>
          <CardHeader>
            <CardTitle>SEO & Meta</CardTitle>
            <CardDescription>
              Manage your site's search engine optimization settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SeoSettingsForm />
          </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="routing">
        <Card>
          <CardHeader>
            <CardTitle>URLs & Routing</CardTitle>
            <CardDescription>
              Configure your site's URL structure and routing behavior.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <UrlsAndRoutingSettingsForm />
          </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="integrations">
        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>
              Connect your site with third-party services and APIs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <IntegrationsSettingsForm />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
