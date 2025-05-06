import { Route, Router } from '@solidjs/router';
import { DefaultPage } from '@/feats/defaultPage';
import { AuthPage } from '@/feats/authentication';
import { ProtectedRoute } from '@/feats/protectedRoute';
import { GeneralProvider } from '@/feats/generalProvider';
import { Header } from '@/feats/headerPage';
import { StylingPage } from '@/feats/styles';
import { MainMenu } from '@/feats/mainMenu';
import { CommandControlProvider } from '@/feats/commandLine';
import { EditCustomer } from '@/feats/components/customer';
import { NewCustomer } from '@/feats/components/customer/NewCustomer';
import { AppendProduct } from '@/feats/components/product';
import { CreateUser, Document, EditUser } from '@/feats/components';
import { Idle } from '@/feats/idle';

//{/* <div class = "font-mono bg-slate-900 text-white" >*/}
export function App(){
  return (
    <GeneralProvider>
      <Router>
        <Route path="/login" component={ () => (
          <>
            <AuthPage /> 
          </>
        ) } />
        <Route path="/lock" component={ () => (
          <>
            <ProtectedRoute>
              <Idle /> 
            </ProtectedRoute>
          </>
        ) } />
        <Route path="/styling" component={ () => (
          <>
            <Header />
            <ProtectedRoute>
              <StylingPage /> 
            </ProtectedRoute>
          </>
        ) }/>
        <Route path="/menu" component={ () => (
          <>
            <Header />
            <ProtectedRoute>
              <MainMenu /> 
            </ProtectedRoute>
          </>
        ) }/>
        <Route path="/customers/edit/:id" component={ () => (
          <>
            <Header />
            <ProtectedRoute>
              <EditCustomer /> 
            </ProtectedRoute>
          </>
        ) }/>
        <Route path="/customers/new" component={ () => (
          <>
            <Header />
            <ProtectedRoute>
              <NewCustomer /> 
            </ProtectedRoute>
          </>
        ) }/>
        <Route path="/products/append" component={ () => (
          <>
            <Header />
            <ProtectedRoute>
              <AppendProduct /> 
            </ProtectedRoute>
          </>
        ) }/>
        <Route path="/users/edit/:id" component={ () => (
          <>
            <Header />
            <ProtectedRoute>
              <EditUser /> 
            </ProtectedRoute>
          </>
        ) }/>
        <Route path="/users/new" component={ () => (
          <>
            <Header />
            <ProtectedRoute>
              <CreateUser /> 
            </ProtectedRoute>
          </>
        ) }/>
        <Route path="/docs/:serial/:reference" component={ () => (
          <>
            <Header />
            <ProtectedRoute>
              <Document /> 
            </ProtectedRoute>
          </>
        ) }/>
        <Route path="/" component={ () => (
          <>
            <Header />
            <CommandControlProvider>
              <ProtectedRoute>
                <DefaultPage />
              </ProtectedRoute>
            </CommandControlProvider>
          </>
        ) }/>
      </Router>
    </GeneralProvider>
  )
}
