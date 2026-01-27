module IconHelper
  def icon(name, size: 20, class_name: nil)
    svg_path = Rails.root.join("app/assets/images/icons/#{name}.svg")
    return "" unless File.exist?(svg_path)

    svg = File.read(svg_path)
    classes = ["icon", class_name].compact.join(" ")
    extra_attrs = [
      %(width="#{ERB::Util.html_escape(size)}"),
      %(height="#{ERB::Util.html_escape(size)}"),
      %(class="#{ERB::Util.html_escape(classes)}"),
      %(aria-hidden="true"),
      %(focusable="false")
    ].join(" ")

    svg = svg.sub(/<svg\b([^>]*)>/) do
      existing = Regexp.last_match(1)
      cleaned = existing.gsub(/\s(width|height|class|aria-hidden|focusable)=\"[^\"]*\"/, "")
      "<svg#{cleaned} #{extra_attrs}>"
    end

    # SVGはローカルファイルのみを読み込むため、そのまま返却する
    svg.html_safe
  end
end
