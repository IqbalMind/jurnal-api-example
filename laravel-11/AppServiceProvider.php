use App\Services\JurnalApi;

public function register()
{
    $this->app->singleton(JurnalApi::class, function ($app) {
        return new JurnalApi(
            config('services.jurnal.username'),
            config('services.jurnal.secret'),
            config('services.jurnal.environment', 'sandbox')
        );
    });
}
