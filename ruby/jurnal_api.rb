require 'net/http'
require 'openssl'
require 'base64'
require 'time'
require 'json'
require 'uri'

class JurnalApi
  attr_reader :username, :secret, :api_url

  def initialize(username, secret, environment = 'sandbox')
    @username = username
    @secret = secret
    @api_url = environment.to_s.downcase == 'production' ? 'https://api.mekari.com' : 'https://sandbox-api.mekari.com'
  end

  def generate_signature(method, path)
    # Format date as RFC 7231 / HTTP-date GMT
    date_string = Time.now.utc.strftime('%a, %d %b %Y %H:%M:%S GMT')
    request_line = "#{method.upcase} #{path} HTTP/1.1"
    string_to_sign = "date: #{date_string}\n#{request_line}"

    digest = OpenSSL::Digest.new('sha256')
    signature = Base64.strict_encode64(OpenSSL::HMAC.digest(digest, @secret, string_to_sign))

    auth_header = "hmac username=\"#{@username}\", algorithm=\"hmac-sha256\", headers=\"date request-line\", signature=\"#{signature}\""

    {
      date: date_string,
      request_line: request_line,
      signature: signature,
      authorization: auth_header
    }
  end

  def request(method, path, body = nil, query_params = nil)
    full_path = path
    if query_params && !query_params.empty?
      query_str = URI.encode_www_form(query_params)
      full_path += (full_path.include?('?') ? '&' : '?') + query_str
    end

    sig = generate_signature(method, full_path)
    uri = URI.parse("#{@api_url}#{full_path}")

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = (uri.scheme == 'https')

    case method.to_s.upcase
    when 'GET'
      req = Net::HTTP::Get.new(uri.request_uri)
    when 'POST'
      req = Net::HTTP::Post.new(uri.request_uri)
    when 'PUT'
      req = Net::HTTP::Put.new(uri.request_uri)
    when 'DELETE'
      req = Net::HTTP::Delete.new(uri.request_uri)
    else
      raise "Unsupported method: #{method}"
    end

    req['Authorization'] = sig[:authorization]
    req['Date'] = sig[:date]
    req['Accept'] = 'application/json'

    if body && !%w[GET DELETE].include?(method.to_s.upcase)
      req['Content-Type'] = 'application/json'
      req.body = body.is_a?(String) ? body : body.to_json
    end

    http.request(req)
  end

  def get(path, query_params = nil)
    request('GET', path, nil, query_params)
  end

  def post(path, body)
    request('POST', path, body)
  end

  def put(path, body)
    request('PUT', path, body)
  end

  def delete(path)
    request('DELETE', path)
  end
end
