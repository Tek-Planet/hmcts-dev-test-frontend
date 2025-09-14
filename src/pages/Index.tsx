import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Shield, Users, Zap } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <div className="space-y-12">
        
        <section className="text-center py-12">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Government Task Service
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Manage and track tasks for government teams. Built to meet accessibility and security requirements.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/register">Start now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </section>

        
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why use this service
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Secure and reliable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Data protection meets government security standards.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-success mb-2" />
                <CardTitle>Accessible for everyone</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Meets WCAG 2.1 AA accessibility standards.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Designed around users</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Designed based on user research with civil servants.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-warning mb-2" />
                <CardTitle>Fast to set up</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Quick setup with straightforward task management.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        
        <section className="bg-muted py-12 px-6 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">Start using the service</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Create an account to start managing tasks.
          </p>
          <Button size="lg" asChild>
            <Link to="/register">Create your account</Link>
          </Button>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
