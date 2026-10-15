require_relative 'jurnal_api'

client_id = ENV['JURNAL_CLIENT_ID'] || 'your-client-id'
client_secret = ENV['JURNAL_CLIENT_SECRET'] || 'your-client-secret'
env = ENV['JURNAL_ENV'] || 'sandbox'

puts "Initializing Ruby Mekari Jurnal Client [#{env}]..."
client = JurnalApi.new(client_id, client_secret, env)

path = '/public/jurnal/api/v1/sales_invoices/2963983'
puts "Sending GET request to #{path}..."

response = client.get(path)
puts "Status Code: #{response.code}"
puts "Response Body:\n#{response.body}"
