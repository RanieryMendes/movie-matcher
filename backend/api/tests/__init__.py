from django.test.runner import DiscoverRunner

class CustomTestRunner(DiscoverRunner):
    def build_suite(self, *args, **kwargs):
        suite = super().build_suite(*args, **kwargs)
        suite.addTests(self.test_loader.discover('api.tests'))
        return suite